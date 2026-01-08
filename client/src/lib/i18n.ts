import { Language } from './storage';

export const translations = {
  ja: {
    app: {
      title: 'Uttar',
      subtitle: '静かな記録を、ここに。',
    },
    nav: {
      record: '記録',
      history: '履歴',
      settings: '設定',
    },
    home: {
      record: '記録する',
      recording: '記録中...',
      recorded: '記録しました',
    },
    history: {
      title: '履歴',
      selectDate: '日付を選択してください',
      noRecords: '記録はありません',
      deleteConfirm: 'この記録を削除しますか？',
    },
    settings: {
      title: '設定',
      twitter: 'X (Twitter) 投稿設定',
      autoTweet: '記録時に投稿画面を開く',
      template: '投稿テンプレート',
      templatePlaceholder: '投稿内容を入力...',
      save: '保存',
      testTweet: 'テスト投稿',
      saved: '設定を保存しました',
      dataManagement: 'データ管理',
      dataDesc: '端末に保存されている全ての記録データを削除します。この操作は元に戻せません。',
      deleteAll: '全データを削除する',
      deleteAllConfirm: '本当に全てのデータを削除しますか？この操作は取り消せません。',
      deletedAll: '全データを削除しました',
      language: '言語設定',
      disclaimer: 'This app is for personal logging only and does not provide medical advice.',
    },
    body: {
      left: '左',
      right: '右',
      abdomen: '腹部',
      thigh: '太もも',
      arm: '腕',
    }
  },
  en: {
    app: {
      title: 'Uttar',
      subtitle: 'Quietly visualize the invisible.',
    },
    nav: {
      record: 'Record',
      history: 'History',
      settings: 'Settings',
    },
    home: {
      record: 'Record',
      recording: 'Recording...',
      recorded: 'Recorded successfully',
    },
    history: {
      title: 'History',
      selectDate: 'Select a date',
      noRecords: 'No records found',
      deleteConfirm: 'Delete this record?',
    },
    settings: {
      title: 'Settings',
      twitter: 'X (Twitter) Settings',
      autoTweet: 'Open post screen on record',
      template: 'Post Template',
      templatePlaceholder: 'Enter post content...',
      save: 'Save',
      testTweet: 'Test Post',
      saved: 'Settings saved',
      dataManagement: 'Data Management',
      dataDesc: 'Delete all records stored on this device. This action cannot be undone.',
      deleteAll: 'Delete All Data',
      deleteAllConfirm: 'Are you sure you want to delete all data? This cannot be undone.',
      deletedAll: 'All data deleted',
      language: 'Language',
      disclaimer: 'This app is for personal logging only and does not provide medical advice.',
    },
    body: {
      left: 'Left',
      right: 'Right',
      abdomen: 'Abdomen',
      thigh: 'Thigh',
      arm: 'Arm',
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];

export const getBodyLabel = (lang: Language, side: string, area: string) => {
  const t = translations[lang].body;
  // @ts-ignore
  return `${t[side]} ${t[area]}`;
};
