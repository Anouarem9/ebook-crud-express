import { RowDataPacket } from "mysql2";

interface EBook extends RowDataPacket {
  ISBN: string,
  titre: string,
  description: string,
  date_edition: string,
  photo: string,
  prix: number,
  categorie: string,
} 

export type { EBook };
