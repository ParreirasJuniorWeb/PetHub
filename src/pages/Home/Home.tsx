import { Hero } from '../../components/home/Hero';
import { Categories } from '../../components/home/Categories';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { Services } from '../../components/home/Services';
import { Newsletter } from '../../components/home/Newsletter';

const Home = () => {
    return (
        <div className="min-h-screen">
            <Hero />
            <Categories />
            <FeaturedProducts />
            <Services />
            <Newsletter />
        </div>
    );
};

export default Home;