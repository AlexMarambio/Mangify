// src/constants/mangas.ts

export interface Manga {
  title: string;
  imageUrl: string;
  pdfUrl: string;
}

const mangas: Manga[] = [
  {
    title: "Chainsaw Man",
    imageUrl: "https://i.pinimg.com/736x/2c/88/f1/2c88f165b1509f5c8f2d61d6db142901.jpg",
    pdfUrl: "/ChainsawManVol1.pdf"
  },
  {
    title: "Armados",
    imageUrl: "https://dthezntil550i.cloudfront.net/ue/current/ue2007251125458030004683825/7114d736-5540-4164-9907-24bdb931cf95_m.jpg",
    pdfUrl: "/armadosMangify.pdf"
  },
  // Puedes agregar más si lo deseas
];

export default mangas;
