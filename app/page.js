'use client'
import Events from '../components/Events';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import TeamPoint from '../components/Teampoint';
import Result from '../components/ResultHome';

export default function App() {

  return (
    <main>
      <Hero />
        <Events />
     
      <TeamPoint />
       <Gallery />   
      <Result />
     
    </main>
  );
}