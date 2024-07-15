import { dbLite } from '../dbLite.js';

// Функция для получения текущей таблицы записи по id
const getCurrentTableNameById = async (id) => {
    console.log(`Получение текущей таблицы для записи с id: ${id}`);
    const sql = `
        SELECT 'dreams' as tableName FROM dreams WHERE id = ?
        UNION ALL
        SELECT 'memories' as tableName FROM memories WHERE id = ?
    `;
    const row = await dbLite.get(sql, [id, id]);
    console.log(`Текущая таблица для записи с id ${id}: ${row ? row.tableName : 'не найдена'}`);
    return row ? row.tableName : null;
};

// Функция для удаления записи по id из указанной таблицы
const deleteRecordById = async (tableName, id) => {
    console.log(`Удаление записи с id: ${id} из таблицы: ${tableName}`);
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    await dbLite.run(sql, [id]);
    console.log(`Запись с id: ${id} успешно удалена из таблицы: ${tableName}`);
};

// Основная функция для обновления записи
export const updateRecord = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
    try {
        console.log(`Начало обновления записи с id: ${id} в таблице: ${tableName}`);
        
        // Получаем текущую таблицу записи по id
        const currentTableName = await getCurrentTableNameById(id);
        
        if (!currentTableName) {
            console.error(`Запись с id ${id} не найдена`);
            throw new Error(`Запись с id ${id} не найдена`);
        }

        // Проверяем, отличается ли новая таблица от текущей
        if (currentTableName !== tableName) {
            console.log(`Перенос записи с id: ${id} из таблицы: ${currentTableName} в таблицу: ${tableName}`);
            
            // Удаляем запись из текущей таблицы
            await deleteRecordById(currentTableName, id);
            
            // Вставляем запись в новую таблицу
            const insertSql = `
                INSERT INTO ${tableName} (id, category, associations, title, content, isAnalyzed, date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [id, category, associations, title, content, isAnalyzed, date];
            console.log(`Добавление новой записи в таблицу: ${tableName} с параметрами:`, params);
            await dbLite.run(insertSql, params);
            
            console.log(`Запись с id ${id} успешно перемещена из ${currentTableName} в ${tableName}`);
        } else {
            // Обновляем запись в текущей таблице
            console.log(`Обновление записи с id: ${id} в таблице: ${tableName}`);
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
                console.error('Нет данных для обновления');
                throw new Error('Нет данных для обновления');
            }

            const columnsToUpdateStr = columnsToUpdate.join(', ');
            const updateSql = `
                UPDATE ${tableName}
                SET ${columnsToUpdateStr}
                WHERE id = ?
            `;
            params.push(id);
            console.log(`Обновление записи в таблице: ${tableName} с параметрами:`, params);
            await dbLite.run(updateSql, params);
            
            console.log(`Запись с id ${id} успешно обновлена в таблице ${tableName}`);
        }
    } catch (error) {
        console.error(`Ошибка обновления записи с id ${id}:`, error);
        throw error;
    }
};
