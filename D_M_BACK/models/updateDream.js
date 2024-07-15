import { dbLite } from '../dbLite.js';

export const updateRecord = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
    try {
        const columnsToUpdate = [];
        const params = [];

        if (category !== undefined) {
            columnsToUpdate.push('category = ?');
            params.push(category);
        }
        if (associations !== undefined) {
            columnsToUpdate.push('associations = ?');
            params.push(associations);
        }
        if (title !== undefined) {
            columnsToUpdate.push('title = ?');
            params.push(title);
        }
        if (content !== undefined) {
            columnsToUpdate.push('content = ?');
            params.push(content);
        }
        if (isAnalyzed !== undefined) {
            columnsToUpdate.push('isAnalyzed = ?');
            params.push(isAnalyzed);
        }
        if (date !== undefined) {
            columnsToUpdate.push('date = ?');
            params.push(date);
        }

        if (columnsToUpdate.length === 0) {
            throw new Error('Нет данных для обновления');
        }

        const columnsToUpdateStr = columnsToUpdate.join(', ');
        const sql = `
            UPDATE ${tableName}
            SET ${columnsToUpdateStr}
            WHERE id = ?
        `;
        
        params.push(id);
        await dbLite.run(sql, params);
        
        console.log(`Запись с id ${id} успешно обновлена`);
    } catch (error) {
        console.error(`Ошибка обновления записи с id ${id}:`, error);
        throw error;
    }
};
