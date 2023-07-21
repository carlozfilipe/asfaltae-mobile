import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'; 
import Image from './Image';


@Entity('points')
export default class Point {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  about: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @OneToMany(() => Image, image => image.point, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'point_id' })
  images: Image[];
}