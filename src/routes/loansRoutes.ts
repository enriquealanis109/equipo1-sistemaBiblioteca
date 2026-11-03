import { Router } from 'express';
import { 
  getLoans, 
  createLoan, 
  updateLoan, 
  deleteLoan 
} from '../controllers/loansControllers';

const router = Router();

router.get('/', getLoans);
router.post('/', createLoan);
router.put('/:id', updateLoan);
router.delete('/:id', deleteLoan);   

export default router;