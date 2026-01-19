import { Template } from './types';

export const FONTS = [
  'Inter', 'Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Helvetica', 'Merriweather', 'Fira Code'
];

export const FONT_SIZES = [
  '8px', '10px', '11px', '12px', '14px', '16px', '18px', '24px', '30px', '36px', '48px', '60px', '72px', '96px'
];

export const COLORS = [
  '#000000', '#444444', '#666666', '#999999', '#CCCCCC', '#EEEEEE', '#FFFFFF',
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    category: 'General',
    content: '<p><br/></p>'
  },
  {
    id: 'resume',
    name: 'Professional Resume',
    category: 'Personal',
    content: `
      <h1 style="text-align: center; border-bottom: 2px solid #333;">JOHN DOE</h1>
      <p style="text-align: center;">123 Street, City, Country | email@example.com | (123) 456-7890</p>
      <h3>PROFESSIONAL SUMMARY</h3>
      <p>Experienced professional with a strong background in project management and strategic planning.</p>
      <h3>EXPERIENCE</h3>
      <p><strong>Job Title</strong> | Company Name | Date - Present</p>
      <ul><li>Key achievement or responsibility 1</li><li>Key achievement or responsibility 2</li></ul>
      <h3>EDUCATION</h3>
      <p><strong>Degree Name</strong> | University Name | Year</p>
    `
  },
  {
    id: 'invoice',
    name: 'Business Invoice',
    category: 'Business',
    content: `
      <div style="display: flex; justify-content: space-between;">
        <h1>INVOICE</h1>
        <div style="text-align: right;">
          <p><strong>Invoice #:</strong> 001</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <hr/>
      <div style="display: flex; justify-content: space-between;">
        <div>
          <h3>Bill To:</h3>
          <p>Client Name<br>Client Address<br>City, Zip</p>
        </div>
        <div style="text-align: right;">
          <h3>From:</h3>
          <p>Your Company<br>Your Address<br>City, Zip</p>
        </div>
      </div>
      <br>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
        <tr style="background-color: #eee;">
          <th style="padding: 10px; border: 1px solid #ccc;">Description</th>
          <th style="padding: 10px; border: 1px solid #ccc;">Qty</th>
          <th style="padding: 10px; border: 1px solid #ccc;">Price</th>
          <th style="padding: 10px; border: 1px solid #ccc;">Total</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Service A</td>
          <td style="padding: 10px; border: 1px solid #ccc;">1</td>
          <td style="padding: 10px; border: 1px solid #ccc;">$100.00</td>
          <td style="padding: 10px; border: 1px solid #ccc;">$100.00</td>
        </tr>
      </table>
      <p style="text-align: right;"><strong>Total Due: $100.00</strong></p>
    `
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    category: 'Personal',
    content: `
      <p>${new Date().toLocaleDateString()}</p>
      <p>Hiring Manager<br>Company Name<br>Company Address</p>
      <p>Dear Hiring Manager,</p>
      <p>I am writing to express my interest in the [Position Name] role at [Company Name]. With my background in [Field], I am confident in my ability to contribute effectively to your team.</p>
      <p>Thank you for your time and consideration.</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
    `
  },
  {
    id: 'meeting-minutes',
    name: 'Meeting Minutes',
    category: 'Business',
    content: `
      <h1 style="text-align: center;">Meeting Minutes</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()} | <strong>Time:</strong> 10:00 AM</p>
      <p><strong>Location:</strong> Conference Room A</p>
      <p><strong>Attendees:</strong> John, Jane, Bob, Alice</p>
      <hr>
      <h3>Agenda</h3>
      <ol><li>Project Updates</li><li>Budget Review</li><li>Next Steps</li></ol>
      <h3>Discussion</h3>
      <p>Summary of discussion points goes here...</p>
      <h3>Action Items</h3>
      <ul><li>[ ] Task 1 (Assigned to John)</li><li>[ ] Task 2 (Assigned to Jane)</li></ul>
    `
  }
];