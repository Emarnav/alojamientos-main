"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 bg-white mb-16"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Encuentra o publica alojamientos fácilmente
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Nuestra plataforma conecta a estudiantes con propietarios de forma ágil y segura.
          </p>
          <p className="mt-2 text-gray-500 max-w-3xl mx-auto">
            Si eres estudiante, podrás descubrir alojamientos ideales cerca de tu universidad. 
            Si eres propietario, tendrás un espacio donde publicar tus propiedades y gestionar los contactos fácilmente.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
          {[
            {
              imageSrc: "/landing-icon-wand.png",
              title: "Explora alojamientos",
              description:
                "Consulta propiedades disponibles filtrando por ubicación, precio o servicios incluidos.",
            },
            {
              imageSrc: "/landing-icon-calendar.png",
              title: "Contacta rápidamente",
              description:
                "Inicia una conversación con el propietario o solicita más información en segundos.",
            },
            {
              imageSrc: "/landing-icon-heart.png",
              title: "Publica tu alojamiento",
              description:
                "Si tienes una propiedad disponible, publícala fácilmente y empieza a recibir mensajes.",
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-72">
    <div className="bg-primary-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
      <Image
        src={imageSrc}
        width={30}
        height={30}
        className="w-full h-full"
        alt={title}
      />
    </div>
    <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

export default DiscoverSection;
