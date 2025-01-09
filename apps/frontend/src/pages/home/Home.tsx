import {Link} from 'react-router';

function Home() {
  return (
    <div>
      <span className='page-title'>
        Connectd AI Update tool
      </span>
      <p className='description'>This is a testing tool for Connectd AI Update tool</p>
      <button>
        <Link to="/chat">Start chat</Link>
      </button>
    </div>
  );
}

export default Home;