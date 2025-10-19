import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepairOrderReviewDto } from './dto/create-repair-order-review.dto';
import { UpdateRepairOrderReviewDto } from './dto/update-repair-order-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrderReview } from './entities/repair-order-review.entity';
import { Repository } from 'typeorm';
import { RepairOrdersService } from 'src/repair-orders/repair-orders.service';
import { OrderRepairStatus } from 'src/repair-orders/entities/enum/order-repair.enum';

@Injectable()
export class RepairOrderReviewsService {
  constructor(
    @InjectRepository(RepairOrderReview)
    private readonly repairOrderReviewRepository: Repository<RepairOrderReview>,

    private readonly repairOrdersService: RepairOrdersService,
  ) {}

  async create(createRepairOrderReviewDto: CreateRepairOrderReviewDto) {
    const repairOrder = await this.repairOrdersService.findOne(
      createRepairOrderReviewDto.repairOrderId,
    );
    if (
      repairOrder.status !== OrderRepairStatus.RESOLVED &&
      repairOrder.status !== OrderRepairStatus.CLOSED
    ) {
      throw new BadRequestException(
        'Cannot create review before the repair is completed',
      );
    }

    const existingReview = await this.repairOrderReviewRepository.findOne({
      where: { repairOrder: { id: createRepairOrderReviewDto.repairOrderId } },
    });
    if (existingReview) {
      throw new BadRequestException(
        'A review for this repair order already exists',
      );
    }

    const review = this.repairOrderReviewRepository.create({
      ...createRepairOrderReviewDto,
      repairOrder,
    });
    return await this.repairOrderReviewRepository.save(review);
  }

  async findAll() {
    return await this.repairOrderReviewRepository.find({
      relations: ['repairOrder'],
    });
  }

  async findOne(id: string) {
    const reviewFound = await this.repairOrderReviewRepository.findOne({
      where: { id },
      relations: ['repairOrder'],
    });
    if (!reviewFound)
      throw new NotFoundException(`Review with id ${id} not found`);
    return reviewFound;
  }

  async update(
    id: string,
    updateRepairOrderReviewDto: UpdateRepairOrderReviewDto,
  ) {
    const review = await this.findOne(id);
    if (
      updateRepairOrderReviewDto.repairOrderId &&
      updateRepairOrderReviewDto.repairOrderId !== review.repairOrder.id
    ) {
      const newRepairOrder = await this.repairOrdersService.findOne(
        updateRepairOrderReviewDto.repairOrderId,
      );
      review.repairOrder = newRepairOrder;
    }
    delete updateRepairOrderReviewDto.repairOrderId;
    Object.assign(review, updateRepairOrderReviewDto);

    return await this.repairOrderReviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    await this.repairOrderReviewRepository.remove(review);
  }
}
