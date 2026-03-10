import { prisma } from '../lib/prisma';

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export const categoryService = {
  async getCategories() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { children: true },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  },

  async getCategory(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
        _count: { select: { products: true } },
      },
    });
    if (!category) throw new Error('Category not found');
    return category;
  },

  async createCategory(input: CreateCategoryInput) {
    return prisma.category.create({ data: input });
  },

  async updateCategory(id: string, input: UpdateCategoryInput) {
    return prisma.category.update({ where: { id }, data: input });
  },

  async deleteCategory(id: string) {
    await prisma.category.delete({ where: { id } });
  },
};
