'use strict';

import express from 'express'
import axios from "axios";
import {ACTIONS} from "./constans.js";
import {
    CanIPoseBomb,
    findBoxetoExplode,
    findSafeZone,
    hasBombAround,
    hasBoxToExplose,
    whichDirectionIsAllowed
} from "./utils.js";

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const data = {
    name:  'botBotsh',
    endpoint: 'https://botsh.app.norsys.io/play',
    promotionName: 'fevrier-2023',
    avatar: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAHf9JREFUeJztnXe8HFXZx7/33twkpEkKAQkxkaiAFGmRKkVQsAQFqRoBaWIEVIqoqFjoIMgLRuEVab4iiDRF6U1RSlABKYEgIYEgJCEQAun3vn/8dmHZfc7u7MyZsnvP9/M5H8jcnTPPlGfmnPM0CAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAg8DZdeQtQEPoBQ4CeUgsE+jT9gb2A3wDPAiuB3lKbA9wAHAYMy0vAQCAPOoCDgOd5WyHqtYXAicDAPIQNBLJkBHAz0RSjuj0GrJO9yIFANoxGD3kc5Si3+cAmWQseCKRNN3AfyZSj3F4E1sxW/ECe9MtbgAw4EdiiwW/mA7OBQcAE3Kt7awAXAZ/wJl1x2BTYAfggGo6uQC+EfwK3oMWLQJsxFliC+4vwO2Czqn3eBUwBXqqzX7soSBdwKDCd+l/OlcCNNH7RBFqM03Hf8EMa7Ls68JBj/9tSkjdL1gGm0dwQsweYCgzIQd5ACjyHfaO/G3H/0cB/jf1XouFWq7IN8Crx52L3oi9toIWZgH1zZ9Lc3OvLjn729ihrlqxHMuUot7voG3PYtmUS9o09qcl+hgDLjH5O9CZpdvQHHsX90L8CXAWcBpwD3A4sr/P7Zq9loEAchH1Td4/Rl/VQnedHzEw5GvuaLAGOw/YYGIsWM6z9lgFrpy51IBUOxL6pu8Toy7KjtJqC9EPLttXn8SawfYT9TzH2bcXrECjxSewb2mj1ymKO0U/UiX5R2BX7ekxpog/LVWcewSu8JRmL/UBc3WQ/Gzn62c2bpNlwFrXn8BzNPdybGX30IiNjoAV5itqbuRyt5ETlCqOPZcCqXiVNn5uoPY9zY/Qz0+jni35ELB6deQuQMpcb2/qhOJChEfY/ANjX2P5HtFTaSowytj0Vo58njW2rxeinJWh3BZkKvG5s3xi4G1jXsV8/4NvArxx/PyO5aJnTYWzr9dS3r34KR7sbeuYje8XZxt82Qcu316LJ53PAYDTO/gLu5cvL0apWqzHX2LZ+jH6s4elLMfoJFIQONCRqxkrsatNpXReLM6k9nxdQOEBUJhp99BJP0QIFYjAaUiVRjoXAuKwF98gu2Of1zYj7dyAnzer9n8cevgVajIHAhSRTkj0zl9of/bBj8ZcDn4mw/xnGvr3IgBhoI3YCHiCegsxFbvCtypHY57UCOBk7i8vawPWO/V5HHs9tS1/+NE4EPgtshTx/hyKfpOdQnMSawB7GfjcQ7Y1bRN6LYvNXcfz9DeAOYAZybNwYXR/XaueRwPmeZQy0CMNQGK715jwwP7Fi0Q0cDyzCz2JFL/DbTM8gUEhc/lyvAe/JUa5m2BF4HH+K0YvcdfpneRKB4nIZ9kNyG8Ueor4beQz4VIwl6EtU5PMOZMxquCPwjshRLhddwNfRV67ew74SuADNw25H8eau374G/BwYn91pFIPwJqhlBLAlmpxuhSbzrhy9b6KHxrJS58FqyCmxkXftNOTm/mDFtjWA7ZD7zUi0sjUHpf25F1jqW9hAa7AhSlR9MXLEq/cmtVqcAKy0OJ/6sr4CHE77++AFPDCS+PaQSvtBkSbr9bwF3iSkTg00wbkkU47FwFcyl7o+p1Ff5oVo3hS+IIGG3EpzCvEaSsH5QzSsKmLtkFWwA7yq231oaBkIOPkO0RTjAvQwtdJb91O4k+aV23LgVELtk4CDbvTwN5qUr0SBV8PzETM2g1EczArqn9/TyD8tEDDZEncO3so2FyV6brWl8c2Idn6XooWLQKCGTrT8OZ/GD9IDyDbSSnQBx9DYF2suMDknGQMtwEgUM1JZ1NM17LqQYr5xV0U1Pj6GnCpPQEPE67Ezkljt2xnLXFhabbiQFROBn9H4S/EKSiBXnsukSTfyrxpTamtW/H/ltsEejvUyrR33EsiATjTnmEfjN+40NJdJgwnAX2j8VfPZXkzpXAJtyAjkqNfoAe1BaYJ854iKMsH23Y71fA4tSxhiiVEoIUO967EZSvdvJWCr5FXge7ytVEnlStsRch7KbvICiln/E5qvBAgKAkr7fwr+c4RNQ7UM5yXooxvNB+KkOV2KvHFfqNPmELx0A3UYT7pj+zi5b6vZD7uAT2V7HM2XPgl8iMZfuUAgEh8h3bH8zZ7k3Bo7ZU9luxSVsQ4EvDEQu0inr+bTnjAaRf7VO96jtHZyu0ABOQb/irEIGeeaSesZhS7kYFjPf+wOz8cM9HEGYX9FbspTqAbsBizAVpBlOcoVaFNcX5G0jH9J6Qb+ii3zwznKFWhTBqEU/mlNsn1zAbZyLAW2zVGuQBtzLPZDt3WeQhkcgXv+cUCOcgXaHNdX5NY8hapiJxQJaCnHqTnK1ba0qiW9E1Wf3QIVbxmPfKAGkuycxmFbrR9BD2HeTACGOP6Wl4w9KMv7i8AzJTnuRXabQIZ0omQJlxLNwza0fNvjyHftA9bNDPhjAMoC+Az53/TQ4rWbgR0IeGdPokfBhVb8dhPhi+KFUaj6bN43NDT/bQmyO7XE/LeIQk4ErgHWavC7lSiBwgOoatIclNwtkC2dKDx3HEqavQ3R0rH+EZXbXpieaO3Hp1EO2XpvoIeAgylmwoSA2AT4CW53mHJ7FMXZByIwifpxDw8BO+cmXSAOg1F05eu47+tTqPRCoA7boGTQ1gVcDHyDYg4HA9FYC+U1dinJP3Hbd/o8Y7At2L2oiGZI2d8edAAn4laSq/MTrbh0AHdiX7AnCePTduRA3GHORSsnkTuHY1+omSgJWhasiVZTzkDZPB5DbhOvoxu5qPTvx0t/PwOl5xyTkXztyKHY9/11ilWQKFdGoMyE1RdpEfKzSpP1gdPRVyrJmv5TSGE2SFneduQc7Gsa6q+XOBX7Ah2e0vE6gb1JXnat3irbvrRWHZE86UaT8+rr2ANsnKNchWAodpniu0lntepzJP9aRG3TkYtMoDGbYM9HfpOnUEXANff4sOfjTAD+7DhW2u1m4H2ez6cduYzaa7cMZXHJnbxsC/dSG6l3C35LKk9G6T+jrK/3oFjuh4AnUNbBV4A30DUahlwp3o9cYSYSrXTZG8gT+bImZe9LrIOuefWzeBRwXvbi5M/q2GlrPuup/36odkejN/wK4Abg8zSf2nMAqgN4CVKCRse6CP8pgNoJq6Dq7blKlCOfp/ZiLAT6e+h7EEq+XO9hfQP5Cflaph0OHE/jIK6bCdZiF4dRe72W0kcLjJ5H7cX4vYd+B6OhW72H9NekZ794F3AW9Ytm3kdQEos1sa9X0RJmZMKd1F6IbybssxsF47gezP+iTOtZMBGtZLlkuRU/X8t2Yza11+rLuUqUE1b97qST84uNPsvtb2TvLToMWd1dMl2esTzVDEbe0+cAdwGz0NBzGVp+fxq4EfgRCpX1XRrC4kZqr9PpGRy3cFheuxsm6O8go79yu478xrGduBO89SJ3i6zZGCW9aFTttrq9jIaPabqB/K9x3EtSPF4h6Yd9A+L6Xa2LexXpBoqxcjQVW77FyOUlC8ajKM1mlMJqy4D/IV5Bn0acZhyvz3n4+laQuxz9/R1YJaGsvujEHV9/TwbHP4xoS9HNtDnAxz3LaSnINZ6P0RJYFzzOytJkR18vk50ncFSGIsdGS979UzpmP1RU1KdiVLaVaHnbF+ELUsK62I0SNFTTjT3Z70WlAYrIpthLwLPwv6rVD82/Gj3k09CDuQ9aUt0YJb+ejCbwUfzXzvAkc1CQEj4U5EuOfn7nT8xU+Am23Id4Ps4ljuP0IgPcVOQ2E4WJ6EGtpyRJl+khKMhb+FCQJ4w+lgLv9SdmKgxBZZ2rZX8af35xXzX6L7e/Id+nOGwP/MfR70qSL9UHBSmRVEG2cvRxgV8xU+N4bPk/4qHvD+BOfvELktszVkUl3qz+55BsdSsoSImkCvJzY/8eog8Z8uZd2KtKF3ro2+VNcL6HvssMxJ1HIEnZ66AgJZIqiFVPsNUKV15M7TnMJdkwazujz14URuA7ynE48KxxrKXA2Jh9FlJBWi08dAPkLl/NlQn73Rs9SNejIZxFf+BnwHxgRmmfuFxlbBtFMo+Co41tC1EWkZ4E/VosQB4M1fRHcRyBBCT5ghzp2D+J3WNSVV9LgN2rftOfWt+qFcB6MY85ANvd42sx+1sNewnZZ512C8sA+hIqV90s4QviASuJ3Aw0QYzLvlX/HoCWiw8s/bt/6d/V9pUutLITh6XAg8b2uMkKJlH7UC5CX7w0OdPYNhplymwLWk1BrCXKfyTsc4GxrQtZoY/DVo4y0xMcd5qxbd2Yfe1obLuO9DOn/w0t/Vbz0ZSPmxmtpiBW8ZUnEvZ5NooGrKYDWYldynExWs2Jy5PGtrjFZTY3tt0Us69msUplb5rRsVMnLQUZgiZrdwOvIkPSi2jMmoQRxrakxSL/g954lpK4uIzk1u8XjG3DaX4lqwPbQGp9ocpsT60bySJk6W/2mbC+4L6W3DdBUaILeecztCet93J/i13QnMCaTLtalEn6IMe+e3iSeyNsK3d1uxQ/N2dzR/9Dm+xnuKOfAY7fD0MvLdf5NZu47+NGH/Ob7APsSXq99iAZlHPzrYX7oMiwNJJOD3ZsX+qp/0dQHfLFdX4zDfmB+Vg2XeHY3mzMuhUQthz3ddkIGStdbNfk8RdFlMk3m6M5UJKl8Yb4VJD1kZNcnCW+JPj0hN2L+nEkm2PbG+LgGkqtbLIfSxG6cd+Hp5ECuXisyeO7FDQLRqLFCNfLs1DUS5rgY4i1imPfAz3J/+Mm5D3Ww/F2cvTdbKBXF3b6znrX9GDsUne30PzD9kWjnxlN9gHND7Eq2/diHC9T3ost+DxkrNoPLZtaCeOiKgjYxrXveJC/GeUot2MSHtPKD2YNV6Jg1ZD/ZIN9hqHh1salFtcT2nLhvyVGPy4FeRUljzgId9hw0oWa1LESJyyjtizA94zfNaMgjxv7XpJMdD7nkKkX+D/gX46/9ZCs+pWllM0Ob8pYFu2zE8jWDNb1sQyIjbAUZDm119gV4x/Xjb8uvuYg44xtdwP/rtqW1KvUsh0kTZX/Mcf2y9DwYSeUt7eaDmDLBMe1aqDENTzebWzbh/TT9awPfMjY7ivW/m5UIqESV77eVGKBfCmItaRo1Sy3rNbNYK25b0iyOISnjW2X8fZq1XzcSmJti0In9mpRXK+APxjb1kRD2zT5hrHtDeA2T/2/amxzPUOprJy1mrHlXmNbJ7Brgj6nohIJIIU4j9ql3LKSlN/UK4AfoGXGOEzEVuq/xuzvGYcsJ5HeCs/6wAHG9qupv1TeJ2nGEzPJHMTlBesjt+8YbEt9NWtR344QhZ9iT9Bdxr0o7Gn02Us6kZYDkE3IOl5cN5Ooz9AajuP6qg7wDlrtC7IU28doEskLrpRrgjTieezhY1QGUOtBDDqvJEbPa7CHfIehOHVfdAC/BDYz/nYdyZ1HC0WrKQjY5bm6gSOyFiQmk7GDvq5I2G8P8n/rNf52Hn4CmbqRk+Zk42+L8WMfakuyGmKBbpIVdvsK8ksqMt1oUaBa9hfxlyb1bKP/cruU+MPDCWie4+r7yERShyFWLFZDhqirgJPRm2sj9BarZjhwYnaixWIKdt3Cn+HPPeNb2Mu+oCyO09HXdlDE/lZHWdb/jTsc+Qr6aLm0qKTxBelCDoSuN5bVVuC/EKgvxiG3bevL5zsZ9AjsEsuV7TW0nH0AsiWNRl+XMSjL4pHAH5HBt14/N+HHH66QXxBfpKEgrvxXjdpTNO8ynjZduBNtH5fSMYcDf3Ec01e7imQrb5UUUkGKPMSKmz7m/ahATZHO7Szs+PXpJMslVY8FyHaTRlz6cuQDtw/+wg0KSZEeomqslZ6ofIbijImPAr5ubF+JfNiWpXjsZWi+8TGShyaX+TuwBXAqenO3NUVWEMto10v0B2oKenvmVQu+LIPrC3Ey8S3xzXIbcsk5kPjuMfegYczW1PpHtS1Z1J6LyzBj2zwUrTgeeW+W24bYFVGnoDHr/shHKCs6gFPQipLFTcAPsxMH0Bfr0lLbCOX+2g55y1rL43OBh1C98uuIF+PR8hRZQazAoUXoRj9Tan+q+NsFyGpczR4onc5+aFUsbVZHD6Er23kPyobycWBmqS3JQK5KHuGd12I4+mIPKsnyMsm8BdqGIiuItXRY70Gagm70XsbfPoh8h05HY+c3E0tXSwdycjwN2W9cdPLO6q296IF8rtRmoqI6s0r/nkVyL+hGLMjgGGmTynzIl4JYRi7rs92MpduaH9WL116JovSWl/5bTTfwXd5+iC/Cj9dpB1oUOAE7P1WU/VcvNZcNZxGqIz4L+YLNrmgvlLalnSQuD6x5qMuhNMshdNMcTu269HJqH5iTjd+57CBWWeDHI8jSQbT45vnIq/bDxJvIj0G1PqxiPnm0hSVZbkcGwFORse9zyKb0HvyXevOJdc8sw+8vjd/1klKJal9fECuOoR8aa/8CDRV2ojljjjWcimKU6kWT438gJbMm+6A30ddK7SVkyHsQKeFsNEldjB6qVZESvx9Narcl5XQzMRiK5lqN0pcuQL5f/0XnXfnfuaX/f7nU8rZxdKHSFheioeensKvrPoG+rt7xuQT6AAoEisNYagPvT6E2O/k86o/vqxmHlMQVVpsmL6I3+LNo1a2yjSv916W8ReF1pDRz0bWfX9FeKbX5KPKvsrlyftXjNOJXzT0M3edCsx3urCWNmjXEOs743QriKfXe2AVf0mhLkOU8ysO/Korp3g0p01nIfeN+9EaPez3zbm+g7JpPALcS7QUVN+3PvRTbnvcOXPX34ijI/o7fxrWw90dvmiiljeO0Rch673MsPAC5me+ArscJaMh6I1qmfSWlc/HdrOwk1cRRkMdI5nGRC4djJyVrVkE+6vjtFgnl6yj1fQkajye58SvRG2wKycNw4zII5ajdEWVh+RbKHnMt+hLNRg9o3kry0wbn0YyC9KCQh9SHqGnYQX6BkiAcjeKky9Wf5iInwqipO626E6CH4f4E8vWiid8d6Py3RI6EE1EigvG4r8s85GD4T6QYt6PzypM3kQfzU3V+04FKvL27oq1R1cpLzWkFncWZ8E9Dvl+bopzFL5X+fQXJarNEJgs/pVEos8Ys3n4DVGNN0jvRsKXaon4mfgrXu+hEMg9HQ5yVaLI6j3QMjEWjG8WGrFbVRlW0kWgVcAS6TlESbm9J/RebNUn/PXrJ9imiDrFAy67Vv73TkxyD0dciT2fGdqGsVHth398oiRxCjcIYWEVgtiC5wetQNDR6Fk30JiTsr6+zHC0YuJZpz8hQlpanmS/IZMfvrZp8URlL7aT1T8bvxgGfriNb4J18H/tePUy0F3EhvyB50IyCjHH8Pmpi5g7kBr9rqS/QKk91f9Xzn0N4u6zyUhQ5F3CzNXYZ6l5g54h9BAUp0YyCgJ24YTaN30qdwA1V+72MvbRbWTtxCLXZG+dGOF5fZTS6H9Z9vbKJfgqpIEV2dy9zHbV+T2sh66xVYbXMpFKrxOWmsjlaOnwErcpU57MdhZIj94VVrGboj1aarBfcPJLnyuqTNPsFWc+xzw0NjnMU9n5x2lxkK/GdnqeV6UD1U1zX7DNN9lfIL0geNKsgAPcZ+/SgQCgX69I4p1Oc9hxSzpPQsuYH6JvDr/NwX6NzYvQXFKREHAVx+WU1uoC7osQIix37+2qLkBJfgNxOtqF4ubl8Ui+96Z3EG7oHBSkRR0H6454IRilb3IVunPUVSktpepC7zLWolsjupFQFKUM6kSuR65wfJ76rSlCQEnEUBJTC39r3MRoHUq2GPdw6onTsT1F/PO2zxakkWwQGYddCLLeZxE/2B0FB3iKugrgyo/eiOIp6WBP2ZcinqIylIEuQ4+ULjuPGbSdGON8i8R7kLuI6n1nA2gmPERSkRFwFAVm2XcOZ3ersZw0Lrqv4+zBsF/1LK34zCoUNH13a/i9kRIyjIK104yehqEHXuczAz9AxKEiJJAoCMj5ZfSzErrgKymBe/fvKKLeDHX02yhTfjWw0k5GX8S3YtUuqm5WKtGgMRYsO9c7jAfwFLAUFKZFUQUbiHvLMQYkVqulAATvzUZ2Lg6r+/mejrweakKma1VFygeOAXyMD5HI0ZJtK8Q20u6Hl7HrKcSV2cr+4BAVBD6p1scfU28lge9xRci9Q3z5icZfRzwFN9tGILopvL9kA+2VR2ZaTTskGS0F8FGdtKbqxL/qa9XZycISjr17ker1DE33tV7X//fgridYKrIe+dCuprxz/QTaeNLAU5Nq6e7Qplu1hfMy+zjL6qnzTHUv0gKhJKNnaIfgdOhSVDjQPu4HG9qAeNB9J0/j5E+O4SQubtiRWJo4tE/Q31eivst1MSln3WpQPAj8iehqkx2nuaxwXa5l9agbHLRyPUnshrFy6UenAfvtUttfR16TIqTfTZG1UEcq69q62AC1pZzXUtCroVicO7BNcTe2FiBoAVY+v4Q7aqRxDH0jxV5F8sAFSioeIrhS9KOnbmbiTRKdBF7Ydao8MZSgMJ1B7IXxVLNoZBUU1egieQbaIvHJZpcEQ5DJzPjq/ZpSiF9UDOZ18ErFt6ZBpXA6y5M52pHsx1kAx5lEeikUoE/rOtN5XZQiytZyEkofHde2fgYZSeeYJPsWQa2aO8uRKP+yw1x94Ps4BKNAp6oMyD2Vb3A+5lRSJbuQlcDDwc+Tm0mg4Wa8tRTmAdyF/20wXtqd2n5ygl7mY2gvyIgpr9cmqaAK/xDhevdaDEi9fhLyItyabaMKhwMaopsd30crOI/gJ/FqBskkeSnrZE+OwN7a8O+Qo01vklTTtI6hqajXHk04OpbFoReRLJFPCl9D4/jmUCaVcR+O1UluM3s5lKz/IFb8/cnEfguY9I0utnPJzLFqK9j0xXobiYK4ttZc995+ULhSusE7V9hkoUrO3Zo8+hLW68irp5qEajfI3PW8cu13aLFQrY3eipQTNk29gn8NX8xSqKHwW++LcRPpfti7gE2gI87pDjlZpc4DfAl+h9k1cZNbBXtp9Hv9D7ZblHuyb/uMMZRiIlkenEm95NMv2Bsoqfy7wBZIHKeXFMNy1HffPUa7CsT7uoKMpOck0FtgXucf/BQ37slaERcg2dCVa3dsLZWnJe8XJB4Ow8wP0onIShaIImc2PRZbbanpRmYNG4bRZsBYaErwPOVauhSbYo9HEelU0CXddz140nFiEJvMLUGzKPDTxL5dyno3W/4s2mfbFcLRYsL3xtwVoKXt2phK1AB3ANbjfphfTOkkOBqLhQ7l2xlD6rv9XNRuhIj/WPV6BUjQFHAxGMRguJXkGu/xvoPgMRO5F9eL38xpOtxTDaexYdwvRs4UH8mUQKpraKHQ3akm+ABqe3ErjSex05L+zLboRgWIwAgWe/YrGFXiX4j+s2TtFmKRX0w9F9h1DNPlWIjf2OWjFKQ4D0ZvuBDRxTsIXUHqilQn7aRU6UVHQcURP/zMb1Vz5e1pC9QV2Inu7hOX+EpUu5EiY9ZJwK7UeZOVvpzCDXFkF+VAlrWfeTIvjyTsY+EOGMrZiu4PGecYCMRmGJnNPku5NXEzzbg6jsavxhibL/+XAVk1e00ACNkXW5XuwfXmStD80Kcs6aP6T94NYlLYcJea7ALnsF91ZsiFFnKQ3QxeaGI5HGdwHEe2cBiNXkmoOQTEgUdgGpcyxXNR7kNfwYxH7amV6kHfAHLTQsSxfcQI+2JPat98K3DUMrf1dRXneRJ7KgUDL8htqH+yoK1hH4060NpdkOb4CgdwZgDLBVz/cjSy6nWhY5hp/z8BOnB0ItBSuGiP1jFyroETKLuW4n+jDs0Cg0PyK2gf84Tq/H4md9a/crie4uwTahH7Y1ZJ+6Pj9BNwu2r0oCrErXZEDgezYGftB38T47YdxZ2nsAb6VgbyBQKZYmeCfNX63G7ICW8qxFDkkBgJtRSdKTlf9wFcbDKfgLiTzKrBjRvIGApmyLfZDv0Pp7x0oebNrvjEbZUwPBNqSs7ENe13INnKF8ffKVa5m6ygGAi3FTGof/ItRqO/dxt/K7TbyzXweCKTOZtgP/1HIodClHJfRt4p5BvooVv2JXuoHYp2ci6SBQA5Mx60I1W0FysYRCPQJ1ie6cixCeXoDgT7D94mmHC8Bm+ckYyCQGw/TWDmm07qZ0gOB2EygsXLcizx2A4E+xzeprxy/JxRrCfRh6sVxnEt71NsIBGJjuav3oLSmgUCfp9q/agkqOxwIBFDOqitRFOE0lMsqEAgEAoFAIBAI5Mf/A9lNvsQvxluFAAAAAElFTkSuQmCC'
}

// methods
const botDoSomething = (action) => {
    console.log('Action', action)
    return { "message": action}
}
// App
const app = express();
// MiddleWare
app.use(express.json());

// Function called every lap to move the bot
app.post('/play', (req,res) => {
    let PLAYER = [];
    const BOXES = [];
    const GRASSES = [];
    const BOMBS = [];

    req.body.lines.map((line, indexY) => {
        line.tiles.map((tile, indexX) => {
            if(tile.type === 'wood'){
                BOXES.push([indexX, indexY]);
            }
            if(tile.type === 'grass' && !tile.player && !tile.bomb){
                GRASSES.push([indexX, indexY]);
            }
            if(tile.bomb){
                BOMBS.push([indexX, indexY]);
            }
            if(tile.player){
                if(tile.player.competitor.name === 'botBotsh'){
                    PLAYER = [indexX,indexY]
                }
            }
        })
    })
    const directionsAllowed = whichDirectionIsAllowed(PLAYER,GRASSES);
    const bombsAround = hasBombAround(PLAYER,BOMBS)
    // est-ce que j'ai une bombe autour de moi ?
    if(findSafeZone(bombsAround, directionsAllowed)){
        // trouver une zone safe et bouger
        console.log('Cherche une zone sure car bombe autour de moi')
        return res.send(botDoSomething(findSafeZone(bombsAround, directionsAllowed)));
    }
    // est-ce que j'ai une caisse autour de moi ?
    if(hasBoxToExplose(PLAYER,BOXES)){
        // est-ce que je peux poser une bombe sans me suicider ?
        console.log("j'ai une caisse près de moi")
        if(CanIPoseBomb(PLAYER,GRASSES,directionsAllowed)){
            // oui je la pose
            console.log("je peux poser une bombe en toute sécurité")
            return res.send(botDoSomething(ACTIONS.BOMB));
        }
    }
    // trouve les boites les plus proches
    const boxesToExplode = findBoxetoExplode(BOXES, PLAYER);
    if(boxesToExplode.length > 0){
        console.log("position du bot", PLAYER)
        // se déplacer vers la boite la plus proche
        if(boxesToExplode[0][1] < PLAYER[1]){
            console.log('Se déplace vers le haut direction',boxesToExplode[0])
            return res.send(botDoSomething(ACTIONS.MOVE_TOP));
        }
        if(boxesToExplode[0][0] > PLAYER[0]){
            console.log('Se déplace vers la droite',boxesToExplode[0])
            return res.send(botDoSomething(ACTIONS.MOVE_RIGHT));
        }
        if(boxesToExplode[0][1] > PLAYER[1]){
            console.log('Se déplace vers le bas direction',boxesToExplode[0])
            return res.send(botDoSomething(ACTIONS.MOVE_BOTTOM));
        }
        if(boxesToExplode[0][0] < PLAYER[0]){
            console.log('Se déplace vers la gauche direction',boxesToExplode[0])
            return res.send(botDoSomething(ACTIONS.MOVE_LEFT));
        }
    }
    // rien a faire
    return res.send(botDoSomething(ACTIONS.STAY));
})

// Registry
app.get('/', (req, res) => {
   axios.post('https://dev-arena.app.norsys.io/api/challenge/register',data,{
       headers:{
        "Content-Type": "application/json"
       }}).then(response => {
        res.send(`LE bot ${response.data.name} id: ${response.data.id} à été inscrit le ${new Date()}`);
        })
        .catch(error => {
            console.log(error);
        });
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
})
