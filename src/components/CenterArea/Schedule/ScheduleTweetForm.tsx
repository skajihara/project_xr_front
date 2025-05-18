// src/components/CenterArea/Schedule/ScheduleTweetForm.tsx
"use client";

import styles from "@/styles/ScheduleTweetForm.module.css";
import btn from "@/styles/Button.module.css";

import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { fetcher } from '@/lib/fetcher'
import { formatDateToJstString } from '@/lib/formatDate'

export default function ScheduleTweetForm() {
  const user = useUserStore((s) => s.user)!;

  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [scheduledDatetime, setScheduledDatetime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!text || !scheduledDatetime) {
      setError("テキストと日時は必須です！");
      return;
    }
    setLoading(true);
    try {
      await fetcher('/schedule', 'POST', {
        account_id: user.id,
        text,
        image: image || null,
        location: null,
        scheduled_datetime: formatDateToJstString(new Date(scheduledDatetime)),
        created_datetime: formatDateToJstString(),
        delete_flag: 0,
      })
      // フォーム初期化
      setText("");
      setImage("");
      setScheduledDatetime("");
      // 最新の一覧を再描画
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("送信に失敗しました。再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h5 className="text-lg font-semibold">新規予約ツイート</h5>

      {error && <p className={styles.error}>{error}</p>}

      <div>
        <label htmlFor="text" className="block mb-1">
          テキスト
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="予約ツイートの内容を入力してね～"
          className={styles.textarea}
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-1">
          画像URL (任意)
        </label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className={styles.input}
        />
      </div>

      <div>
        <label htmlFor="scheduledDatetime" className="block mb-1">
          予約日時
        </label>
        <input
          id="scheduledDatetime"
          type="datetime-local"
          value={scheduledDatetime}
          onChange={(e) => setScheduledDatetime(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`${btn.button} ${btn.primary} ${loading ? btn.disabled : ""}`}
      >
        {loading ? "送信中…" : "予約ツイート登録"}
      </button>
    </form>
  );
}
