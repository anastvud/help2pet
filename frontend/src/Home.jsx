import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="title">Your Profile:</h1>
        <div className="button-group">
          <Link to="/dashboard" className="btn">Find Sitters</Link>
          <Link to="/my-pets" className="btn">My Pets</Link>
          {/* Add more buttons here if needed */}
        </div>
      </div>
    </div>
  );
}

export default Home;
