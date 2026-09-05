'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export type SortOrder = 'asc' | 'desc' | null;

export interface UseTableSortOptions<T> {
  initialKey?: string | null;
  initialOrder?: SortOrder;
  valueExtractors?: Record<string, (item: T) => any>;
}

const CEFR_ORDER: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

/**
 * Hook sắp xếp dữ liệu bảng linh hoạt khi click trực tiếp vào nhãn cột
 */
export function useTableSort<T>(
  data: T[],
  optionsOrKey?: UseTableSortOptions<T> | string | null,
  initialOrderArg?: SortOrder,
  valueExtractorsArg?: Record<string, (item: T) => any>,
) {
  let initialKey: string | null = null;
  let initialOrder: SortOrder = null;
  let valueExtractors: Record<string, (item: T) => any> | undefined = undefined;

  if (optionsOrKey && typeof optionsOrKey === 'object') {
    initialKey = optionsOrKey.initialKey ?? null;
    initialOrder = optionsOrKey.initialOrder ?? null;
    valueExtractors = optionsOrKey.valueExtractors;
  } else {
    initialKey = (optionsOrKey as string | null) ?? null;
    initialOrder = initialOrderArg ?? null;
    valueExtractors = valueExtractorsArg;
  }

  const [sortKey, setSortKey] = useState<string | null>(initialKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        // Reset về thứ tự ban đầu
        setSortKey(null);
        setSortOrder(null);
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return data;

    return [...data].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (valueExtractors && valueExtractors[sortKey]) {
        valA = valueExtractors[sortKey](a);
        valB = valueExtractors[sortKey](b);
      } else {
        valA = (a as any)?.[sortKey];
        valB = (b as any)?.[sortKey];
      }

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // 1. So sánh CEFR
      const upperA = String(valA).trim().toUpperCase();
      const upperB = String(valB).trim().toUpperCase();
      if (CEFR_ORDER[upperA] && CEFR_ORDER[upperB]) {
        return sortOrder === 'asc'
          ? CEFR_ORDER[upperA] - CEFR_ORDER[upperB]
          : CEFR_ORDER[upperB] - CEFR_ORDER[upperA];
      }

      // 2. So sánh Số (Number)
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      // 3. So sánh Date
      if (valA instanceof Date && valB instanceof Date) {
        return sortOrder === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }

      // 4. So sánh chuỗi số hoặc giá tiền dạng string (VD: '1500000', '25')
      const strA = String(valA).trim();
      const strB = String(valB).trim();
      const numA = Number(strA);
      const numB = Number(strB);
      if (!isNaN(numA) && !isNaN(numB) && strA !== '' && strB !== '' && !strA.startsWith('0') && strA.length < 15) {
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      // 5. So sánh văn bản chuẩn tiếng Việt (hỗ trợ có dấu, phân biệt chữ hoa thường cơ bản)
      const cmp = strA.localeCompare(strB, 'vi', { sensitivity: 'base', numeric: true });
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortOrder, valueExtractors]);

  return {
    sortKey,
    sortOrder,
    toggleSort,
    sortedData,
    setSortKey,
    setSortOrder,
  };
}

/**
 * Component hiển thị icon chỉ hướng sắp xếp trên tiêu đề cột bảng
 */
export const SortIndicator: React.FC<{
  sortKey: string;
  activeKey: string | null;
  sortOrder: SortOrder;
}> = ({ sortKey, activeKey, sortOrder }) => {
  if (sortKey !== activeKey || !sortOrder) {
    return (
      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400/70 group-hover:text-teal-600 transition inline-block shrink-0 ml-1" />
    );
  }

  if (sortOrder === 'asc') {
    return (
      <ArrowUp className="w-3.5 h-3.5 text-teal-600 font-bold inline-block shrink-0 ml-1 animate-in zoom-in-75 duration-100" />
    );
  }

  return (
    <ArrowDown className="w-3.5 h-3.5 text-teal-600 font-bold inline-block shrink-0 ml-1 animate-in zoom-in-75 duration-100" />
  );
};
