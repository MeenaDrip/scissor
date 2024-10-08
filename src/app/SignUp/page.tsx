'use client';
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/app/Firebase/firebase'; // Update this path as needed
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import Google from '../assets/Google_Icon.png';
import BackgroundLogo from '../assets/Bg-Logo.png';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #fff;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: #fff;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background-color: #fff;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 15px;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin: 0;
    max-width: 100%;
    padding: 20px;
    box-shadow: none;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #2d614b;
  text-align: center;
`;

const GoogleButton = styled.button`
  background-color: #fff;
  color: #2d614b;
  padding: 15px;
  border: 1px solid black;
  border-radius: 30px;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin-right: 15px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  font-size: 14px;
  color: #777;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin: 15px 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 15px;
  color:  #2d614b;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 5px;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const ButtonPrimary = styled.button`
  background-color: #2d614b;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
    margin-top: 10px;
    
  }
`;

const FooterText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #333;

  @media (max-width: 768px) {
    margin-top: 15px;
    font-size: 12px;
  }
`;

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser!);
      setMessage('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/Dashboard'); // Redirect to your desired page after successful sign-in
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  
  return (
    <Container>
      <LogoContainer>
        <Image src={BackgroundLogo} alt="About Logo" width={500} height={500} />
      </LogoContainer>
      <FormContainer>
        <Title>Sign Up</Title>
        <GoogleButton onClick={handleGoogleSignIn}>
          <Image src={Google} alt="Google Logo" width="20" height="20" />
          Continue with Google
        </GoogleButton>
        <Separator>or</Separator>
        <Form onSubmit={handleSignUp}>
          <InputContainer>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputContainer>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <ButtonPrimary type="submit">Sign Up</ButtonPrimary>
        </Form>
        <FooterText>
        Already have an account? <Link href="/Login">Login</Link>
        </FooterText>
      </FormContainer>
    </Container>
  );
};

export default SignUpPage;
