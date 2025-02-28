// Данные для таблицы
const data = {
	title: 'Состав заявки на сборку',
	account: 'ОКУТ-034514',
	pm: 'WB',
	dateOfReadiness: '23.02.2025',
	table: [{
		cell: '1-2-0',
		article: 'FN46840384-65410',
		productName: 'Джинсы',
		size: '3XXL',
		color: 'Черный',
		toSelect: '4',
		notes: ''
	},
	{
		cell: '1-2-0, 1-2-0, 1-2-0, 1-2-0, 1-2-0',
		article: 'FN46840384-65410',
		productName: 'Джинсы',
		size: '3XXL',
		color: 'Черный-Белый',
		toSelect: '4',
		notes: ''
	},
	{
		cell: '1-2-0',
		article: 'FN46840384-65410',
		productName: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia architecto aut similique magni sunt sapiente ipsam sint eius consectetur! Animi ad eius saepe recusandae fugiat quas, dolores ipsum cum velit.',
		size: '3XXL',
		color: 'Черный',
		toSelect: '4',
		notes: ''
	},
	{
		cell: '1-2-0, 1-2-0, 1-2-0',
		article: 'FN46840384-65410',
		productName: 'Джинсы',
		size: '3XXL',
		color: 'Черный',
		toSelect: '4',
		notes: ''
	},
	]
}


// Функция для создания и скачивания PDF
function createAndDownloadPDF(data) {
	return new Promise((resolve, reject) => {
		try {
			// Создаем новый документ PDF
			const doc = new window.jspdf.jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4"
			});

			// Добавляем шрифт Roboto
			doc.addFileToVFS("./Roboto-Regular.ttf");
			doc.addFileToVFS("./Roboto-Bold.ttf");
			doc.addFont("./Roboto-Regular.ttf", "Roboto", "normal");
			doc.addFont("./Roboto-Bold.ttf", "Roboto", "bold");
			doc.setFont("Roboto");

			// Добавляем контент в PDF
			const date = new Date();
			const dateString = date.toLocaleString("ru-RU", { hour12: false });
			doc.setFontSize(10);
			const pageWidth = doc.internal.pageSize.getWidth();
			const textWidth = doc.getStringUnitWidth(dateString) * doc.internal.getFontSize() / doc.internal.scaleFactor;
			const margin = 10;
			const x = pageWidth - textWidth - margin;
			doc.text(dateString, x, 10);

			doc.setFont("Roboto", "bold");
			doc.setFontSize(16);
			doc.text(data.title, 10, 20);
			doc.setFont("Roboto", "normal");
			// 
			doc.setFontSize(12);
			doc.text("Счет: ", 10, 30);
			doc.setFont("Roboto", "bold");
			doc.text(`${data.account}`, 10 + doc.getTextWidth("Счет: "), 30);
			doc.setFont("Roboto", "normal");
			// 
			doc.text("Маркетплейс: ", 10, 36);
			doc.setFont("Roboto", "bold");
			doc.text(`${data.pm}`, 10 + doc.getTextWidth("Маркетплейс: "), 36);
			doc.setFont("Roboto", "normal");
			// 
			doc.text("Дата готовности: ", 10, 42);
			doc.setFont("Roboto", "bold");
			doc.text(`${data.dateOfReadiness}`, 10 + doc.getTextWidth("Дата готовности: "), 42);
			doc.setFont("Roboto", "normal");
			// 

			const tableData = data.table.map((item, index) => [
				index + 1,
				item.cell,
				item.article,
				item.productName,
				item.size,
				item.color,
				item.toSelect,
				item.notes
			]);

			const headers = [
				"№",
				"Ячейка",
				"Артикул",
				"Название товара",
				"Размер",
				"Цвет",
				"Кол-во",
				"Примечания"
			];

			doc.autoTable({
				head: [headers],
				body: tableData,
				startY: 53,
				styles: { font: "Roboto" },
				margin: { left: 10, right: 10 },
				theme: 'grid',
				columnStyles: {
					0: { cellWidth: 'auto' },
					1: { halign: 'center' },
					5: { halign: 'center' },
					6: { halign: 'center' }
				},
				headStyles: {
					fillColor: '#111111',
					textColor: '#ffffff',
					fontStyle: 'bold'
				}
			});

			const totalPages = doc.getNumberOfPages();
			addPageNumber(doc, totalPages);

			// Сохраняем PDF
			doc.save("output.pdf");
			resolve(undefined); // Успешное завершение
		} catch (error) {
			reject(error); // Ошибка
		}
	});
}

// Функция для добавления номера страницы
function addPageNumber(doc, totalPages) {
	for (let i = 1; i <= totalPages; i++) {
		doc.setPage(i);
		doc.setFontSize(10);
		doc.text(
			`${i}/${totalPages}`,
			doc.internal.pageSize.width - 10,
			doc.internal.pageSize.height - 10,
			{ align: 'right' }
		);
	}
}

const btn = document.getElementById("downloadBtn");

btn.addEventListener("click", async () => {
	// Блокируем кнопку и добавляем лоадинг
	btn.disabled = true;
	btn.innerHTML = "Загрузка..."; // Меняем текст кнопки

	try {
		// Вызываем функцию создания PDF
		await createAndDownloadPDF(data);
	} catch (error) {
		console.error("Ошибка при создании PDF:", error);
	} finally {
		// Восстанавливаем кнопку
		btn.disabled = false;
		btn.innerHTML = "Скачать PDF"; // Возвращаем исходный текст
	}
});

