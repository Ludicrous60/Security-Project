import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';
import zxcvbn from 'zxcvbn'; // Import zxcvbn for password strength checking

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  // Function to evaluate password strength
  const evaluatePasswordStrength = (password) => {
    const result = zxcvbn(password);
    let strengthMessage = '';

    switch (result.score) {
      case 0:
        strengthMessage = 'Very Weak';
        break;
      case 1:
        strengthMessage = 'Weak';
        break;
      case 2:
        strengthMessage = 'Moderate';
        break;
      case 3:
        strengthMessage = 'Strong';
        break;
      case 4:
        strengthMessage = 'Very Strong';
        break;
      default:
        strengthMessage = 'Unknown Strength';
    }

    setPasswordStrength(strengthMessage);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    evaluatePasswordStrength(newPassword);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Validate password complexity
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else if (!/[A-Z]/.test(password)) {
      setMessage('Password must have at least one uppercase letter');
    } else if (!/[a-z]/.test(password)) {
      setMessage('Password must have at least one lowercase letter');
    } else if (!/[0-9]/.test(password)) {
      setMessage('Password must have at least one number');
    } else if (!/[@#$%^&+=!]/.test(password)) {
      setMessage('Password must have at least one special character');
    } else if (password.length < 8 || password.length > 15) {
      setMessage('Password must be 8-15 characters long');
    } else {
      setMessage(null); // Clear any previous messages
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={handlePasswordChange}
          ></Form.Control>
          <Form.Text className='text-muted'>
            Password Strength: {passwordStrength}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Register
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
