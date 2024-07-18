// SELECT d.*, 
//        GROUP_CONCAT(a.links) AS associations, 
//        GROUP_CONCAT(v.link) AS videos, 
//        GROUP_CONCAT(i.link) AS images
// FROM dreams d
// LEFT JOIN dream_associations da ON d.id = da.dream_id
// LEFT JOIN association a ON da.association_id = a.id
// LEFT JOIN dream_videos dv ON d.id = dv.dream_id
// LEFT JOIN video v ON dv.video_id = v.id
// LEFT JOIN dream_imgs di ON d.id = di.dream_id
// LEFT JOIN img i ON di.img_id = i.id
// WHERE d.id = ?
// GROUP BY d.id;


// =============================================

// SELECT m.*, 
//        GROUP_CONCAT(a.links) AS associations, 
//        GROUP_CONCAT(v.link) AS videos, 
//        GROUP_CONCAT(i.link) AS images
// FROM memories m
// LEFT JOIN memory_associations ma ON m.id = ma.memory_id
// LEFT JOIN association a ON ma.association_id = a.id
// LEFT JOIN memory_videos mv ON m.id = mv.memory_id
// LEFT JOIN video v ON mv.video_id = v.id
// LEFT JOIN memory_imgs mi ON m.id = mi.memory_id
// LEFT JOIN img i ON mi.img_id = i.id
// WHERE m.id = ?
// GROUP BY m.id;
