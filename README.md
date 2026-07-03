# Heroes Online

MMO game project.

## Repository Structure

```
heroes-online/
│
├── docs/                 # Исходные Markdown-документы
├── specs/                # Формальные спецификации (API, протоколы)
├── backend/
├── frontend/
├── database/
├── infrastructure/
├── assets/
├── design/
├── tests/
├── scripts/
│
├── mkdocs.yml            # Конфигурация сайта документации
├── docker-compose.yml    # Локальная инфраструктура
├── .env.example          # Шаблон переменных окружения
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── README.md
└── LICENSE
```

## Documentation

Исходники документации лежат в [`docs/`](docs/). Оглавление — [`docs/README.md`](docs/README.md).

Сайт собирается через [MkDocs](https://www.mkdocs.org/) с темой [Material](https://squidfunk.github.io/mkdocs-material/).

### Локальный просмотр

```bash
pip install -r requirements-docs.txt
mkdocs serve
```

Сайт будет доступен на http://127.0.0.1:8000

### Сборка

```bash
mkdocs build
```

Результат — в каталоге `site/` (не коммитится).

> Автоматическая публикация через GitHub Actions будет добавлена позже.

## Alpha Bootstrap (before v0.1.0-alpha)

The project is in **game engine operations** mode — new work adds game systems on the core, not architecture.

**Only real risk left:** stability on a fresh environment.

```bash
cp backend/.env.example backend/.env
bash scripts/fresh-clone-gate.sh    # or .\scripts\fresh-clone-gate.ps1
```

See [Fresh Clone Gate](docs/00_Project/10_Fresh_Clone_Gate.md). If green → `git tag v0.1.0-alpha`.

## Getting Started

```bash
cp .env.example .env
docker compose up -d
```

Подробнее — в [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
