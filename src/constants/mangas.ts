// src/constants/mangas.ts

export interface Manga {
  title: string;
  imageUrl: string;
  pdfUrl: string;
}

const mangas: Manga[] = [
  {
    title: "Armados",
    imageUrl: "https://dthezntil550i.cloudfront.net/ue/current/ue2007251125458030004683825/7114d736-5540-4164-9907-24bdb931cf95_m.jpg",
    pdfUrl: "/armadosMangify.pdf"
  },
  {
    title: "Armados 2",
    imageUrl: "https://dthezntil550i.cloudfront.net/ue/current/ue2007251125458030004683825/7114d736-5540-4164-9907-24bdb931cf95_m.jpg",
    pdfUrl: "/armadosMangify-2.pdf"
  },
  // Puedes agregar más si lo deseas
];

export default mangas;
