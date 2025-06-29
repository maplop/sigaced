import { db } from '../database'
import { Phase } from '../../shared/types'

export function getPhases(): Phase[] {
  return db.prepare('SELECT * FROM phase').all()
}
