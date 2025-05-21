namespace backend.Models
{
    public class CrowdSnapshot
    {
        public int Id { get; set; }
        public int RideId { get; set; }
        public decimal CrowdScore { get; set; }
        public int WaitTime { get; set; }
        public DateTime Timestamp { get; set; }
        public Ride? Ride { get; set; }

    }
}