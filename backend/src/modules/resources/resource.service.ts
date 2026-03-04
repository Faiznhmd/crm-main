import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from 'src/user/dto/create-resource.dto';
import { UpdateResourceDto } from 'src/user/dto/update-resource.dto';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  // ADMIN - Create
  create(dto: CreateResourceDto) {
    return this.prisma.resource.create({ data: dto });
  }

  // PUBLIC - Get all resources (return ALL bookings)
  findAll() {
    return this.prisma.resource.findMany({
      include: {
        bookings: true, // return ALL bookings, do NOT filter
      },
    });
  }

  // PUBLIC - Get one resource (return ALL bookings)
  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        bookings: true, // return ALL bookings, do NOT filter
      },
    });

    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  // ADMIN - Update
  async update(id: number, dto: UpdateResourceDto) {
    const exists = await this.prisma.resource.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Resource not found');

    return this.prisma.resource.update({
      where: { id },
      data: dto,
    });
  }

  // ADMIN - Delete
  async delete(id: number) {
    const exists = await this.prisma.resource.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Resource not found');

    await this.prisma.resource.delete({ where: { id } });
    return { message: 'Resource deleted successfully' };
  }

  // ADMIN - Get all resources with bookings
  getAllResources() {
    return this.prisma.resource.findMany({
      include: { bookings: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // PUBLIC - Get resources with computed booking status
  async findAllWithStatus() {
    const now = new Date();

    const resources = await this.prisma.resource.findMany({
      include: {
        bookings: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return resources.map((resource) => {
      const activeBooking = resource.bookings.some((b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);

        return (
          b.status !== 'COMPLETED' &&
          b.status !== 'REJECTED' &&
          b.status !== 'CANCELLED' &&
          now >= start &&
          now <= end
        );
      });

      return {
        id: resource.id,
        name: resource.name,
        type: resource.type,
        location: resource.location,
        description: resource.description,
        maxDuration: resource.maxDuration,
        requiresApproval: resource.requiresApproval,
        status: activeBooking ? 'BOOKED' : resource.status,
        createdAt: resource.createdAt,
      };
    });
  }
}
