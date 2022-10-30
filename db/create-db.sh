dbname=$1

if [ -f $dbname ]
then
    echo "db file $dbname already exists"
    exit 1
fi

sqlite3 $dbname "create table scores(answer text, guess text, score text)"

shift
while (( "$#" )); do
    filename=$1
    cat="cat"
    if [ "${filename: -3}" == ".gz" ]
    then
        cat="gzip -cd"
    fi
    $cat $filename | sqlite3 $dbname ".import /dev/stdin scores"
    shift
done


sqlite3 $dbname "create unique index idx_scores_guess_answer on scores(guess, answer); create index idx_scores_guess_score on scores(guess, score)"

sqlite3 $dbname "create table answers(answer text not null primary key); insert into answers select distinct answer from scores"

sqlite3 $dbname "create table guesses(guess text not null primary key); insert into guesses select distinct guess from scores"

sqlite3 $dbname "create table responses(score text not null primary key); insert into responses select distinct score from scores"

sqlite3 $dbname "create table log2_lookup(n int not null primary key, log2n float not null)"

perl -e 'for $i (1..20000) {print $i,"|",log($i),"\n";}' | \
    sqlite3 $dbname ".import /dev/stdin log2_lookup"

