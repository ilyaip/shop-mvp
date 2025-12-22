/**
 * Mock data for the e-commerce application
 * Contains sample products and categories for development and testing
 */

import type { Product } from '../types/global';

/**
 * Available product categories
 */
export const mockCategories = [
  'Электроника',
  'Одежда',
  'Книги',
  'Дом и сад',
] as const;

/**
 * Mock product data - 12 products across multiple categories
 */
export const mockProducts: Product[] = [
  // Электроника (4 products)
  {
    id: '1',
    title: 'Беспроводные наушники',
    description:
      'Качественные беспроводные наушники с активным шумоподавлением и длительным временем работы до 30 часов',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
    ],
    category: 'Электроника',
  },
  {
    id: '2',
    title: 'Смартфон Premium',
    description:
      'Флагманский смартфон с OLED-дисплеем 6.7", тройной камерой 108MP и быстрой зарядкой 65W',
    price: 54999,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1592286927505-b0c2966a2e3c?w=400',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    ],
    category: 'Электроника',
  },
  {
    id: '3',
    title: 'Умные часы',
    description:
      'Спортивные умные часы с мониторингом здоровья, GPS и водонепроницаемостью до 50 метров',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
    ],
    category: 'Электроника',
  },
  {
    id: '4',
    title: 'Портативная колонка',
    description:
      'Мощная Bluetooth-колонка с объемным звуком, защитой от воды и временем работы до 20 часов',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400',
    ],
    category: 'Электроника',
  },

  // Одежда (4 products)
  {
    id: '5',
    title: 'Классическая футболка',
    description:
      'Удобная хлопковая футболка базового кроя, идеально подходит для повседневной носки',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400',
    ],
    category: 'Одежда',
  },
  {
    id: '6',
    title: 'Джинсы Slim Fit',
    description:
      'Стильные джинсы зауженного кроя из качественного денима с эластаном для комфорта',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400',
    ],
    category: 'Одежда',
  },
  {
    id: '7',
    title: 'Кожаная куртка',
    description:
      'Классическая кожаная куртка из натуральной кожи с утеплителем для прохладной погоды',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    ],
    category: 'Одежда',
  },
  {
    id: '8',
    title: 'Спортивные кроссовки',
    description:
      'Легкие беговые кроссовки с амортизацией и дышащим верхом для максимального комфорта',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    ],
    category: 'Одежда',
  },

  // Книги (2 products)
  {
    id: '9',
    title: 'Программирование на TypeScript',
    description:
      'Полное руководство по современной разработке с TypeScript, включая продвинутые паттерны и best practices',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    ],
    category: 'Книги',
  },
  {
    id: '10',
    title: 'Дизайн-мышление',
    description:
      'Практическое руководство по применению дизайн-мышления в бизнесе и разработке продуктов',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    ],
    category: 'Книги',
  },

  // Дом и сад (2 products)
  {
    id: '11',
    title: 'Набор кухонных ножей',
    description:
      'Профессиональный набор из 5 ножей из нержавеющей стали с деревянной подставкой',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400',
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=400',
    ],
    category: 'Дом и сад',
  },
  {
    id: '12',
    title: 'Комнатное растение Монстера',
    description:
      'Живое комнатное растение Монстера в керамическом горшке, высота 60-70 см',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400',
    images: [
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400',
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400',
    ],
    category: 'Дом и сад',
  },
];
