import {useAuth} from '../../hooks/useAuth.tsx';
import {useState} from 'react';
import './login.css';

function Login() {
  const { login } = useAuth();

  const companies = [
    'Strelka',
    'MOTO-MATE Ltd',
    'Relay Technologies',
    'Regno Cloud Limited',
    'Yordex',
    'clearBorder',
    'Prevayl',
    'Twyn Limited',
    'New Motion Labs',
    'Hit and Run Ltd',
    'Swerve',
    'evRiderz Ltd',
    'Valerian',
    'Just Move In',
    'Omnium - Myparceldelivery.com Ltd',
    'Shipergy Ltd',
    'Lounges.tv Ltd',
    'Ocushield',
    'Infranomics'
  ];

  const [company, setCompany] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    login(company);
  }


  return (
    <main className='login-container'>
      <img className="login-first-image" src="https://cdn.connectd.co/auth-assets/background-hex.svg" alt='backgroud'/>
      <img className="login-second-image" src="https://cdn.connectd.co/auth-assets/background-hex.svg" alt='backgroud'/>
      <div className='login-form-wrapper'>
        <div className='login-form'>
          <form onSubmit={handleLogin}>
            <h2>Sign in to Connectd</h2>
            <div>
              <select onChange={e => {setCompany(e.target.value);}}>
                <option disabled selected>Select company*</option>
                {companies.map((company) => (<option value={company} key={company}>{company}</option>))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <div className='login-footer'>
            <p>Don't have an account? <b>Unlucky</b></p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;