import React, { useEffect, useMemo, useState } from 'react';
import { validateNote, parseTags } from '../utils/validators';

/**
 * Note editor used for create and edit flows.
 * Props:
 *  - mode: 'create' | 'edit'
 *  - note: note object in edit mode
 *  - onSave(payload)
 *  - onDelete()
 *  - onCancel()
 */
// PUBLIC_INTERFACE
export default function NoteEditor({ mode, note, onSave, onDelete, onCancel, loading }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState((note?.tags || []).join(', '));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const hasChanges = useMemo(() => {
    if (mode === 'create') {
      return !!(title || content || tags);
    }
    return title !== (note?.title || '') ||
      content !== (note?.content || '') ||
      tags !== (note?.tags || []).join(', ');
  }, [title, content, tags, note, mode]);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTags((note?.tags || []).join(', '));
  }, [note?.id]);

  const handleSave = () => {
    const payload = { title: title.trim(), content: content.trim(), tags: parseTags(tags) };
    const val = validateNote(payload);
    setErrors(val);
    if (Object.keys(val).length === 0) {
      onSave(payload);
    }
  };

  return (
    <div className="card editor" role="region" aria-label="Note editor">
      <div className="field">
        <label className="label" htmlFor="title">Title</label>
        <input
          id="title"
          className="textfield"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(s => ({ ...s, title: true }))}
        />
        {(touched.title && errors.title) ? <div className="helper error">{errors.title}</div> : <div className="helper">Required</div>}
      </div>

      <div className="field">
        <label className="label" htmlFor="content">Content</label>
        <textarea
          id="content"
          className="textarea"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => setTouched(s => ({ ...s, content: true }))}
          rows={12}
        />
        {(touched.content && errors.content) ? <div className="helper error">{errors.content}</div> : <div className="helper">Required</div>}
      </div>

      <div className="field">
        <label className="label" htmlFor="tags">Tags</label>
        <input
          id="tags"
          className="textfield"
          placeholder="Comma separated e.g. work, ideas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="helper">Optional</div>
      </div>

      <div className="form-actions">
        {mode === 'edit' ? (
          <button className="btn btn-danger" onClick={onDelete} disabled={loading}>Delete</button>
        ) : null}
        <button className="btn" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {mode === 'edit' ? 'Save' : 'Create'}
        </button>
      </div>

      {hasChanges ? <div className="helper">Unsaved changes</div> : null}
    </div>
  );
}
