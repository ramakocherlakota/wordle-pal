select guess, sum(c * log2n) / sum(c) as h from (select guess, score, count(*) as c from scores group by 1, 2 ) as t1, log2_lookup where c = n group by 1 order by 2;
