import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer",
    content:
      "DevPath helped me transition from a complete beginner to a professional frontend developer in just 6 months. The roadmaps are incredibly detailed and the resources are top-notch.",
    avatar: "AJ",
  },
  {
    name: "Sarah Chen",
    role: "Full Stack Engineer",
    content:
      "I've tried many learning platforms, but DevPath stands out with its visual roadmaps and curated resources. It helped me fill gaps in my knowledge and advance my career.",
    avatar: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "Self-taught Developer",
    content:
      "As someone learning to code on my own, DevPath has been invaluable. The structured roadmaps gave me direction and confidence in my learning journey.",
    avatar: "MR",
  },
]

export function TestimonialSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary border border-primary/20 mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Loved by Developers</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our community has to say about their learning experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16 stagger-fade-in">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full hover-lift glass-card">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${testimonial.avatar}`}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <Quote className="absolute top-0 left-0 h-6 w-6 text-primary/20 -translate-x-2 -translate-y-2" />
                <p className="text-muted-foreground pt-2 pl-2">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
