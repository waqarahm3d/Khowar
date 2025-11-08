import { useState } from 'react';
import Button from '../common/Button';

export default function CommentForm({ onSubmit, onCancel, isSubmitting }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        maxLength={500}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        required
        autoFocus
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-gray-500 text-xs">
          {text.length}/500 characters
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!text.trim() || isSubmitting}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </form>
  );
}
