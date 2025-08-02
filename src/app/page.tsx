'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Counter animation hook
function useCountUp(
  end: number,
  duration: number = 2000,
  start: boolean = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

// Intersection Observer hook
function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, options]);

  return isIntersecting;
}

// Hero Section Component
function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero-bg.jpg')`,
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-5xl leading-tight font-bold md:text-7xl">
          Transforming Lives through Service
        </h1>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed md:text-2xl">
          Compassion ignites Change. Join us as we embark on a mission to make a
          difference in our community at Manipal Academy of Higher Education.
        </p>
      </div>
    </section>
  );
}

// Metrics Section Component
function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.3 });

  const volunteersCount = useCountUp(2500, 2000, isVisible);
  const projectsCount = useCountUp(150, 2000, isVisible);
  const hoursCount = useCountUp(50000, 2500, isVisible);
  const livesCount = useCountUp(25000, 2500, isVisible);

  const metrics = [
    { label: 'Active Volunteers', value: volunteersCount, suffix: '+' },
    { label: 'Projects Completed', value: projectsCount, suffix: '+' },
    { label: 'Service Hours', value: hoursCount, suffix: '+' },
    { label: 'Lives Impacted', value: livesCount, suffix: '+' },
  ];

  return (
    <section ref={ref} className="bg-indigo-950 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-6xl">
                {metric.value.toLocaleString()}
                {metric.suffix}
              </div>
              <div className="text-lg text-blue-100 md:text-xl">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Mission Section Component
function MissionSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-5xl">
            Our Mission
          </h2>
          <p className="mb-12 text-lg leading-relaxed text-gray-700 md:text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Community Service
              </h3>
              <p className="text-gray-600">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Leadership Development
              </h3>
              <p className="text-gray-600">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Social Impact
              </h3>
              <p className="text-gray-600">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Gallery Section Component
function GallerySection() {
  // Mock gallery images - replace with your actual images
  const galleryImages = [
    '/gallery-1.png',
    '/gallery-2.jpg',
    '/gallery-3.jpg',
    '/gallery-4.jpg',
    '/gallery-5.jpg',
    '/gallery-6.jpg',
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our Impact in Pictures
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Witness the transformative power of service through our community
            initiatives and volunteer activities.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
            <CarouselContent className="-ml-4">
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2">
                  <Card className="overflow-hidden p-0">
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <Image
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          {/* Thumbnail gallery */}
          <div className="mt-8 grid grid-cols-6 gap-4">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover transition-opacity duration-200 hover:opacity-75"
                  sizes="(max-width: 768px) 16vw, 12vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Reviews Section Component
function ReviewsSection() {
  const reviews = [
    {
      company: 'Tech Innovators Inc.',
      logo: '/nss.svg',
      review:
        'NSS MAHE volunteers consistently demonstrate exceptional dedication and professionalism in their community service projects. Their impact on local communities is truly remarkable.',
      author: 'Sarah Johnson',
      position: 'Community Relations Director',
    },
    {
      company: 'Green Future Foundation',
      logo: '/nss.svg',
      review:
        'Working with NSS MAHE has been an incredible experience. Their environmental initiatives have made a significant difference in promoting sustainability awareness.',
      author: 'Michael Chen',
      position: 'Environmental Program Manager',
    },
    {
      company: 'Healthcare Plus',
      logo: '/nss.svg',
      review:
        'The health awareness campaigns organized by NSS MAHE have reached thousands of people. Their volunteers are well-trained and passionate about making a difference.',
      author: 'Dr. Priya Sharma',
      position: 'Public Health Director',
    },
    {
      company: 'Education First',
      logo: '/nss.svg',
      review:
        "NSS MAHE's educational outreach programs have transformed learning opportunities for underprivileged children. Their commitment to education is commendable.",
      author: 'Robert Williams',
      position: 'Program Coordinator',
    },
    {
      company: 'Community Connect',
      logo: '/nss.svg',
      review:
        'The leadership skills and social responsibility demonstrated by NSS MAHE volunteers make them valuable partners in community development initiatives.',
      author: 'Ananya Gupta',
      position: 'Partnership Manager',
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            What Our Partners Say
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover how NSS MAHE has made a meaningful impact through the words
            of our valued community partners.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent className="-ml-6">
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="pl-6 md:basis-1/2">
                  <Card className="h-full">
                    <CardContent>
                      <div className="mb-6 flex items-center">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                          <Image
                            src={review.logo}
                            alt={`${review.company} logo`}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-gray-900">
                            {review.company}
                          </h4>
                        </div>
                      </div>

                      <blockquote className="mb-6 text-gray-700">
                        "{review.review}"
                      </blockquote>

                      <div className="border-t pt-4">
                        <div className="font-medium text-gray-900">
                          {review.author}
                        </div>
                        <div className="text-sm text-gray-600">
                          {review.position}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <MissionSection />
      <GallerySection />
      <ReviewsSection />
    </>
  );
}
