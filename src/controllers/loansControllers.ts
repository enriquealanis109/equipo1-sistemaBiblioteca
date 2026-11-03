import {Request, Response} from 'express';
import {pool} from '../config/db';

export const getLoans = async (req: Request, res: Response) => { 
    try {
        const result = await pool.query('SELECT * FROM loans');
        return res.status(200).json(result.rows)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener los préstamos. Intente nuevamente.'
        })
    }
};
export const createLoan = async (req:Request, res: Response) => { 
    const {book_id, user_id, loan_date, due_date, return_date} = req.body;

    try {
        const query = `
        INSERT INTO loans (book_id, user_id, loan_date, due_date, return_date)
        RETURNING *`
        const values = [book_id, user_id, loan_date, due_date, return_date];
        const result = await pool.query(query, values);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al registrar el préstamo de libro. Intente nuevamente.'
        })
    }
};

export const updateLoan = async (req:Request, res: Response) => {
    const {id} = req.params;
    const {book_id, user_id, loan_date, due_date, return_date} = req.body;

    try {
        const query = `
        UPDATE loans
        SET book_id, user_id, loan_date, due_date, return_date
        RETURNING *`
        const values = [book_id, user_id, loan_date, due_date, return_date];
        const result = await pool.query(query, values);

        if(result.rows.length === 0) {
            return res.status(404).json ({
                ok: false,
                message: 'Préstamo no encontrado'
            })
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar el préstamo.'
        })
    }
};
export const deleteLoan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM loans', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }
    return res.status(200).json({ 
      message: 'Préstamo eliminado exitosamente', 
      loan: result.rows[0] 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar el préstamo' });
  }
};
