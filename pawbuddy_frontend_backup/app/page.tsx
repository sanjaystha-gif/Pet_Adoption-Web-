import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6">
            <div className="mb-4 text-sm text-white bg-rose-200/40 inline-block px-3 py-1 rounded" style={{backgroundColor: 'var(--coral-50)', color: 'var(--coral-300)'}}>Home</div>

            <h1 className="font-extrabold hero-title" style={{fontSize:'2.8rem', lineHeight:1.05}}>
              Give a New Life to
              <div className="mt-3" style={{fontSize:'3.6rem'}}>
                <span className="font-handwriting" style={{color:'var(--coral-300)', marginRight:'0.5rem'}}>Furry</span>
                <span style={{color:'#7a1410'}}>Friends</span>
              </div>
            </h1>

            <p className="mt-6 hero-sub">
              Pet adoption and rehoming are both vital aspects of animal welfare, offering hope and a fresh
              start to pets in need. Open your heart and your home to a shelter pet.
            </p>

            <div className="mt-8 flex gap-4">
              <Link href="#" className="btn-primary">Adopt Now</Link>
              <Link href="#" className="btn-outline">Rehome Now</Link>
            </div>
          </div>

          <div className="md:col-span-6 relative">
            <div className="w-full h-96 relative">
              <div className="hero-art-circle" />

              <img
                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60"
                alt="cat"
                className="hero-image-cat"
              />

              <img
                src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=900&q=60"
                alt="dog"
                className="hero-image-dog"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}