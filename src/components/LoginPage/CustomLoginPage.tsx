import { Login, LoginForm } from 'react-admin';
import { TextInput, required } from 'react-admin';

const CustomLoginForm = () => (
  <LoginForm>
    <TextInput
      source="email"
      label="Email"
      autoComplete="email"
      validate={required()}
      fullWidth
    />
    <TextInput
      source="password"
      label="Password"
      type="password"
      autoComplete="current-password"
      validate={required()}
      fullWidth
    />
  </LoginForm>
);

const CustomLoginPage = () => (
  <Login>
    <CustomLoginForm />
  </Login>
);

export default CustomLoginPage;
