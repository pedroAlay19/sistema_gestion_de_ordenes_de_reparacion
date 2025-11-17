import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepairOrderReviewDto } from './dto/create-repair-order-review.dto';
import { UpdateRepairOrderReviewDto } from './dto/update-repair-order-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrderReview } from './entities/repair-order-review.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { RepairOrdersService } from 'src/repair-orders/repair-orders.service';
import { OrderRepairStatus } from 'src/repair-orders/entities/enum/order-repair.enum';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRole } from 'src/users/entities/enums/user-role.enum';
import { WebSocketNotificationService } from '../websocket/websocket-notification.service';

@Injectable()
export class RepairOrderReviewsService {
  constructor(
    @InjectRepository(RepairOrderReview)
    private readonly repairOrderReviewRepository: Repository<RepairOrderReview>,

    private readonly repairOrdersService: RepairOrdersService,

    private readonly wsNotificationService: WebSocketNotificationService,
  ) {}

  async create(
    createRepairOrderReviewDto: CreateRepairOrderReviewDto,
    user: JwtPayload,
  ) {
    const repairOrder = await this.repairOrdersService.findOne(
      createRepairOrderReviewDto.repairOrderId,
      user,
    );
    if (!repairOrder)
      throw new NotFoundException(
        `Repair order with ID ${createRepairOrderReviewDto.repairOrderId} not found.`,
      );
    if (repairOrder.status !== OrderRepairStatus.DELIVERED)
      throw new BadRequestException(
        'Cannot create review before the repair is completed',
      );
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
    const saveReview = await this.repairOrderReviewRepository.save(review);

    // Las reviews no están actualmente en las estadísticas del dashboard admin
    // Si se agregan métricas de reviews, descomentar:
    // await this.wsNotificationService.notifyDashboardUpdate('REVIEW_CREATED', saveReview.id);

    return saveReview;
  }

  async findAll(user: JwtPayload) {
    const reviews = await this.repairOrderReviewRepository.find({
      relations: ['repairOrder'],
    });

    switch (user.role) {
      case UserRole.ADMIN:
        return reviews;

      case UserRole.TECHNICIAN: {
        return await this.repairOrderReviewRepository.find({
          where: {
            repairOrder: {
              repairOrderDetails: { technician: { id: user.sub } },
            },
          },
        });
      }

      case UserRole.USER: {
        return await this.repairOrderReviewRepository.find({
          where: { repairOrder: { equipment: { user: { id: user.sub } } } },
        });
      }
      default:
        return [];
    }
  }

  async findBestsReviews() {
    return await this.repairOrderReviewRepository.find({
      where: { rating: MoreThanOrEqual(4), visible: true },
      select: {
        rating: true,
        comment: true,
        repairOrder: {
          equipment: {
            name: true,
            user: {
              name: true,
              lastName: true,
            },
          },
        },
      },
    });
  }

  async findByRepairOrderId(repairOrderId: string) {
    const reviewFound = await this.repairOrderReviewRepository.findOne({
      where: { repairOrder: { id: repairOrderId }, visible: true },
    });
    if (!reviewFound)
      throw new NotFoundException(
        `Review for repair order id ${repairOrderId} not found`,
      );
    return reviewFound;
  }

  async findOne(id: string, user: JwtPayload) {
    if (user.role === UserRole.ADMIN) {
      const reviewFound = await this.repairOrderReviewRepository.findOne({
        where: { id },
      });
      if (!reviewFound)
        throw new NotFoundException(`Review with id ${id} not found`);
      return reviewFound;
    }

    const reviewFound = await this.repairOrderReviewRepository.findOne({
      where: { repairOrder: { equipment: { user: { id: user.sub } } } },
    });
    if (!reviewFound)
      throw new NotFoundException(`Review with id ${id} not found`);
    return reviewFound;
  }

  async update(
    id: string,
    updateRepairOrderReviewDto: UpdateRepairOrderReviewDto,
    user: JwtPayload,
  ) {
    const review = await this.findOne(id, user);
    Object.assign(review, updateRepairOrderReviewDto);
    return await this.repairOrderReviewRepository.save(review);
  }

  async remove(id: string, user: JwtPayload) {
    const review = await this.findOne(id, user);
    await this.repairOrderReviewRepository.remove(review);
  }
}
