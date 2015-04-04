set @game_count = (select count(*) from `match`);

select championId, c.`name`, count(*) as count, count(*) * 100 / @game_count as pick_rate
from participant p
inner join champion c on c.id = p.championId
group by championId
order by count(*);

select championId, c.`name`, count(*) as count, count(*) * 100 / @game_count as ban_rate
from banned_champion bc
inner join champion c on c.id = bc.championId
group by championId
order by count(*);

select championId, c.`name`, count(*) as count, count(*) * 100 / @game_count as pick_ban_rate
from (
	select championId, matchId
	from participant
	union
	select championId, matchId
	from banned_champion
) pr
inner join champion c on c.id = pr.championId
group by championId
order by count(*);