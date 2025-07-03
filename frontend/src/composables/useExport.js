import { utils as XLSXUtils, writeFile as XLSXWriteFile } from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Export task data to Excel and PDF.
 * @param {Array} tasks - Array of task objects
 * @param {Function} formatDate - Function to format due date
 * @param {Number} currentPage - Current page number
 * @param {Number} perPage - Number of items per page
 */
export function useExport(tasks, formatDate, currentPage = 1, perPage = 10) {
  const exportToExcel = () => {
    const taskData = tasks.map((task, index) => ({
      Sr: (currentPage - 1) * perPage + index + 1,
      Title: task.title,
      Description: task.description,
      'Due Date': formatDate(task.dueDate),
      'Assigned To': Array.isArray(task.assignedTo)
        ? task.assignedTo.map((u) => u.name).join(', ')
        : task.assignedTo?.name || '-',
      Status: getStatusLabel(task.status),
    }))

    const worksheet = XLSXUtils.json_to_sheet(taskData)
    const workbook = XLSXUtils.book_new()
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Tasks')

    XLSXWriteFile(workbook, 'Tasks.xlsx')
  }

  const exportToPDF = () => {
    const doc = new jsPDF('landscape')

    const tableData = tasks.map((task, index) => [
      (currentPage - 1) * perPage + index + 1,
      task.title,
      task.description,
      formatDate(task.dueDate),
      Array.isArray(task.assignedTo)
        ? task.assignedTo.map((u) => u.name).join(', ')
        : task.assignedTo?.name || '-',
      getStatusLabel(task.status),
    ])

    autoTable(doc, {
      head: [['Sr', 'Title', 'Description', 'Due Date', 'Assigned To', 'Status']],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 60 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 },
        5: { cellWidth: 25 },
      },
      headStyles: {
        fillColor: [41, 128, 185],
        halign: 'center',
      },
    })

    doc.save('Tasks.pdf')
  }

  const getStatusLabel = (status) => {
    const map = {
      pending: 'Pending',
      in_progress: 'Progress',
      submitted: 'Submitted',
      verified: 'Done',
      cancelled: 'Cancelled',
    }

    return map[status] || 'Unknown'
  }

  return { exportToExcel, exportToPDF }
}
