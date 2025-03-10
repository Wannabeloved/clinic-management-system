import Application from "../models/Application.js";
import { formatPhoneNumber } from "../utils/phoneFormatter.js";

export const getApplications = async ({
  page = 1,
  limit = 10,
  search = "",
  sortField = "createdAt",
  sortOrder = "desc",
}) => {
  try {
    console.log("Получение заявок с параметрами:", {
      page,
      limit,
      search,
      sortField,
      sortOrder,
    });

    // Базовый запрос
    let query = {};

    // Добавляем поиск, если есть
    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
          { problemDescription: { $regex: search, $options: "i" } },
        ],
      };
    }

    console.log("Поисковый запрос:", query);

    // Проверяем допустимые поля для сортировки
    const allowedSortFields = [
      "fullName",
      "phoneNumber",
      "createdAt",
      "status",
    ];
    if (!allowedSortFields.includes(sortField)) {
      sortField = "createdAt";
    }

    // Настраиваем сортировку
    const sort = { [sortField]: sortOrder === "desc" ? -1 : 1 };
    console.log("Сортировка:", sort);

    // Получаем общее количество записей
    const total = await Application.countDocuments(query);
    console.log("Всего заявок:", total);

    // Получаем записи с пагинацией и сортировкой
    const applications = await Application.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Найдено заявок:", applications.length);

    return {
      applications,
      pagination: {
        currentPage: page,
        pages: Math.ceil(total / limit),
        total,
      },
    };
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    throw new Error("Ошибка при получении заявок");
  }
};

export const createApplication = async applicationData => {
  try {
    console.log("Создание заявки с данными:", applicationData);

    // Форматируем телефон перед сохранением
    const formattedData = {
      ...applicationData,
      phoneNumber: formatPhoneNumber(applicationData.phoneNumber),
    };

    console.log("Отформатированные данные:", formattedData);

    const application = new Application(formattedData);
    await application.save();

    console.log("Заявка создана:", application);
    return application;
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    if (error.message === "Некорректный формат номера телефона") {
      throw new Error(
        "Пожалуйста, проверьте правильность введенного номера телефона"
      );
    }
    throw error;
  }
};

export const updateApplicationStatus = async (id, status) => {
  try {
    console.log("Обновление статуса заявки:", { id, status });

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      throw new Error("Заявка не найдена");
    }

    console.log("Статус обновлен:", application);
    return application;
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
    throw error;
  }
};
