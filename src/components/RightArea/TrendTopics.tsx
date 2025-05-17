// src/components/RightArea/TrendTopics.tsx
'use client'

import styles from '@/styles/TrendTopics.module.css'

import { useTrends } from '@/hooks/useTrends'

export default function TrendTopics() {
  const trends = useTrends()

  return (
    <section className={styles.card}>
      <h3 className={styles.heading}>トレンドトピックス</h3>
      <ul className={styles.list}>
        {trends.map(({ category, topic, count }) => (
          <li key={topic} className={styles.item}>
            <p className={styles.category}>{category}のトレンド</p>
            <p className={styles.topic}>{topic}</p>
            <p className={styles.count}>{count.toLocaleString()} tweets</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
