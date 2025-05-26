import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const { id, name, image } = category;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link 
        to={`/products?category=${id}`}
        className={cn(
          "group block relative overflow-hidden rounded-lg aspect-[4/3]",
        )}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
        
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          
          <span className="inline-flex items-center text-sm font-medium group-hover:underline">
            Shop Now
            <svg 
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}