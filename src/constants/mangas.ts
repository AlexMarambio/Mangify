// src/constants/mangas.ts

export interface Manga {
  title: string;
  imageUrl: string;
  pdfUrl: string;
}

const mangas: Manga[] = [
  {
    title: "Naruto",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    pdfUrl: "/NarutoVol1.pdf"
  },
  {
    title: "One Piece",
    imageUrl: "https://i.pinimg.com/736x/01/7e/2f/017e2f2db03a579590f38c8fff990cba.jpg",
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
