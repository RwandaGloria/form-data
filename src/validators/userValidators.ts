import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import validation from '../helpers/validation';
import { Department } from '../models/user';

export default class Validation {
  private readonly userIdValidationSchema: Joi.Schema;
  private readonly createUserSchema: Joi.Schema;
  private readonly updateUserSchema: Joi.Schema;
  private readonly getSingleUserSchema: Joi.Schema;

  constructor() {
    

    this.userIdValidationSchema = Joi.object({
      userId: Joi.string().length(24).hex().required().label("userId"),
    });
    this.updateUserSchema = Joi.object({
        firstName: Joi.string().optional().trim().min(2).max(50).label("firstName"),
        lastName: Joi.string().optional().trim().min(2).max(50).label("lastName"),
        email: Joi.string().optional().email().label("email"),
        dateOfBirth: Joi.date().optional().label("dateOfBirth"),
        comments: Joi.string().optional().max(500).label("comments"),
        department: Joi.string().valid(...Object.values(Department)).optional().label("department"),
        userId: Joi.string().label("userId").length(24).required()
      });

    this.createUserSchema = Joi.object({
        firstName: Joi.string().optional().trim().min(2).max(50).label("firstName"),
        lastName: Joi.string().optional().trim().min(2).max(50).label("lastName"),
        email: Joi.string().optional().email().label("email"),
        dateOfBirth: Joi.date().optional().label("dateOfBirth"),
        comments: Joi.string().optional().max(500).label("comments"),
        department: Joi.string().valid(...Object.values(Department)).required().label("department"),
    });

    this.getSingleUserSchema =  Joi.object({
      userId: Joi.string().label("userId").length(24)

    })
  }


  
  validateDeleteUser = (req: Request, res: Response, next: NextFunction): void => {
    validation(this.userIdValidationSchema, req.query, res, next);
  };
  validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
    validation(this.createUserSchema, req.body, res, next);
  };
  validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
    validation(this.updateUserSchema, req.body, res, next);
  };
  validateGetSingleUser = (req: Request, res: Response, next: NextFunction): void => {
    validation(this.getSingleUserSchema, req.query, res, next);
  };
}
