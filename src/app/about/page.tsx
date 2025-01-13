import React from 'react';
import Link from 'next/link';

const About: React.FC = () => {
  return (
    <div>
      <h1>About This Project</h1>
      <p>This project is a collection of youth group songs.</p>
      <Link href="/">Back to Home</Link>
    </div>
  );
};

export default About;
