import { dbLite } from '../dbLite.js';

export const updateRecordById = async (tableName, id, associations, title, content, isAnalyzed, date) => {
    console.log(`/update updateRecord : tableName-${tableName}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);

    try {
        // Сначала получаем существующую запись по id
        const sqlGet = `SELECT * FROM ${tableName} WHERE id = ?`;
        const existingRecord = await dbLite.get(sqlGet, [id]);

        if (!existingRecord) {
            throw new Error('Запись не найдена');
        }

        // Обновляем запись в основной таблице
        const updatedFields = {
            title: title !== undefined ? title : existingRecord.title,
            content: content !== undefined ? content : existingRecord.content,
            isAnalyzed: isAnalyzed !== undefined ? isAnalyzed : existingRecord.isAnalyzed,
            date: date !== undefined ? date : existingRecord.date,
        };

        const sqlUpdate = `
            UPDATE ${tableName}
            SET title = ?, content = ?, isAnalyzed = ?, date = ?
            WHERE id = ?
        `;

        await dbLite.run(sqlUpdate, [
            updatedFields.title,
            updatedFields.content,
            updatedFields.isAnalyzed,
            updatedFields.date,
            id
        ]);

        // Работа с ассоциациями
        if (associations !== undefined) {
            // Используем строку ассоциаций напрямую
            const associationsStr = associations;
            console.log('ASSOCIATIONS ... : ', associationsStr);

            // Определяем таблицу ассоциаций в зависимости от основного tableName
            let associationTable;
            switch (tableName) {
                case 'dreams':
                    associationTable = 'dream_associations';
                    break;
                case 'memories':
                    associationTable = 'memory_associations';
                    break;
                default:
                    throw new Error(`Неверное имя таблицы: ${tableName}`);
            }

            // Удаляем старые ассоциации
            // const sqlDeleteOldAssociations = `DELETE FROM ${associationTable} WHERE ${tableName.slice(0, -1)}_id = ?`;
            // await dbLite.run(sqlDeleteOldAssociations, [id]);

           
        }

        return { success: true, message: 'Запись успешно обновлена' };

    } catch (error) {
        console.error('Ошибка обновления записи:', error);
        throw new Error('Ошибка обновления записи');
    }
};
