function Home() {
    return (
        <div className="container mx-auto py-16 text-center">
            <h1 className="text-5xl font-bold text-indigo-600 mb-6">
                Welcome to TrainMate
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                Book your train seats effortlessly with our intuitive system. Sign up or
                log in to reserve your spot today!
            </p>
            <a
                href="/register"
                className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition"
            >
                Get Started
            </a>
        </div>
    );
}

export default Home;