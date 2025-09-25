import { HeroParallax } from '@/components/ui/hero-paralax';

export function ProjectsSection() {
    return <HeroParallax products={products} />;
}

const products = [
    {
      title: 'FoteArte',
      link: 'https://github.com/cseis06/fotearte',
      thumbnail: '/projects/fotearte.jpg'
    },
    {
      title: 'Patriota',
      link: 'https://github.com/cseis06/patriota',
      thumbnail: '/projects/patriota.jpg'
    },
    {
      title: 'Zentry',
      link: 'https://github.com/cseis06/zentry',
      thumbnail: '/projects/zentry.jpg'
    },
    {
      title: 'Xora',
      link: 'https://github.com/cseis06/xora',
      thumbnail: '/projects/xora.jpg'
    },
    {
      title: 'My Ecommerce',
      link: 'https://github.com/cseis06/my-ecommerce',
      thumbnail: '/projects/my-ecommerce.jpg'
    },
    {
      title: 'Lunardi',
      link: 'https://github.com/cseis06/lunardi',
      thumbnail: '/projects/lunardi.jpg'
    }
  ];
  