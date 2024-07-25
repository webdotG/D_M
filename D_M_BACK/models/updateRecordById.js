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
            const newAssociationsStr = associations;
            console.log('NEW ASSOCIATIONS: ', newAssociationsStr);

            // Определяем таблицу ассоциаций в зависимости от основного tableName
            let associationTable;
            let itemIdField;
            switch (tableName) {
                case 'dreams':
                    associationTable = 'dream_associations';
                    itemIdField = 'dream_id';
                    break;
                case 'memories':
                    associationTable = 'memory_associations';
                    itemIdField = 'memory_id';
                    break;
                default:
                    throw new Error(`Неверное имя таблицы: ${tableName}`);
            }

            // Получаем текущие ассоциации
            const sqlGetAssociations = `SELECT a.id, a.link FROM ${associationTable} da JOIN association a ON da.association_id = a.id WHERE da.${itemIdField} = ?`;
            const existingAssociations = await dbLite.all(sqlGetAssociations, [id]);
            console.log(existingAssociations)
            // Проверяем изменения и обновляем ассоциации
            if (existingAssociations.length > 0) {
                const existingAssociationsMap = new Map(existingAssociations.map(assoc => [assoc.link, assoc.id]));

                if (!existingAssociationsMap.has(newAssociationsStr)) {
                    // Новая ассоциация не совпадает с текущей, создаем новую
                    const sqlInsertAssociation = `INSERT INTO association (link) VALUES (?)`;
                    const result = await dbLite.run(sqlInsertAssociation, [newAssociationsStr]);
                    const newAssociationId = result.lastID;

                    // Удаляем старую привязку
                    const sqlDeleteOldAssociation = `DELETE FROM ${associationTable} WHERE ${itemIdField} = ? AND association_id = ?`;
                    await dbLite.run(sqlDeleteOldAssociation, [id, existingAssociations[0].id]);

                    // Добавляем новую привязку
                    const sqlInsertNewAssociation = `INSERT INTO ${associationTable} (${itemIdField}, association_id) VALUES (?, ?)`;
                    await dbLite.run(sqlInsertNewAssociation, [id, newAssociationId]);

                    // Проверяем, есть ли другие привязки к старой ассоциации
                    const sqlCheckOldAssociation = `SELECT COUNT(*) as count FROM ${associationTable} WHERE association_id = ?`;
                    const { count } = await dbLite.get(sqlCheckOldAssociation, [existingAssociations[0].id]);

                    // Если нет других привязок, удаляем старую ассоциацию
                    if (count === 0) {
                        const sqlDeleteOldAssociationRecord = `DELETE FROM association WHERE id = ?`;
                        await dbLite.run(sqlDeleteOldAssociationRecord, [existingAssociations[0].id]);
                    }
                }
            }
        }

        return { success: true, message: 'Запись успешно обновлена' };

    } catch (error) {
        console.error('Ошибка обновления записи:', error);
        throw new Error('Ошибка обновления записи');
    }
};
