import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL 环境变量未设置');
  process.exit(1);
}

const sql = postgres(connectionString);

async function migrate() {
  try {
    console.log('🔗 连接数据库...');

    // 读取 SQL 文件
    const sqlFile = path.join(__dirname, '../supabase-schema.sql');
    const schema = fs.readFileSync(sqlFile, 'utf-8');

    console.log('📝 执行迁移脚本...\n');

    // 分割并执行每条 SQL 语句
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      if (statement) {
        await sql.unsafe(statement);
      }
    }

    console.log('✅ 数据库表创建成功！\n');

    // 验证表是否存在
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'games', 'questions', 'characters')
      ORDER BY table_name;
    `;

    console.log('📊 已创建的表:');
    tables.forEach(t => console.log(`   - ${t.table_name}`));

  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
