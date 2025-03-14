package com.example.Rentify.reservation;

import com.example.Rentify.entity.ArticleInstance;
import com.example.Rentify.entity.Reservation;
import com.example.Rentify.entity.Status;
import com.example.Rentify.repo.ArticleInstanceRepo;
import com.example.Rentify.repo.ReservationRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReservationCleanupTask {

    private final ReservationRepo reservationRepo;
    private final ArticleInstanceRepo articleInstanceRepo;

    public ReservationCleanupTask(ReservationRepo reservationRepo,
                                  ArticleInstanceRepo articleInstanceRepo) {
        this.reservationRepo = reservationRepo;
        this.articleInstanceRepo = articleInstanceRepo;
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cleanUpExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expired = reservationRepo.findByExpiryTimeBefore(now);
        for (Reservation reservation : expired) {
            // Setze den Status der Artikelinstanz zurück, falls nötig
            ArticleInstance instance = reservation.getArticleInstance();
            instance.setStatus(Status.AVAILABLE);
            articleInstanceRepo.save(instance);
            // Lösche die Reservation
            reservationRepo.delete(reservation);
        }
    }
}

